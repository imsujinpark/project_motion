import { BaseComponent, Component } from "../component.js";

export interface Composable {
    addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = "start" | "stop" | "enter" | "leave";
type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void;

// Component와 Composable 관련된 모든 것들이 구현됨
interface SectionContainer extends Component, Composable {
    setOnCloseListener(listener: OnCloseListener): void;
    setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
    muteChildren(state: "mute" | "unmute"): void;
    getBoundingRect(): DOMRect;
    onDropped(): void;
}

type SectionContainerConstructor = {
    // 아무 것도 받지 않는 생성자가 있고 SectionContainer를 만드는 그 어떤 class는 다 괜찮다
    new(): SectionContainer
}

export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer {
    private closeListener?: OnCloseListener;
    private dragStateListener?: OnDragStateListener<PageItemComponent>;

    constructor() {
        super(`<li draggable="true" class="page-item">
                     <section class="page-item__body"></section>
                    <div class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </li>`);
        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.onclick = () => {
            this.closeListener && this.closeListener();
        };

        this.element.addEventListener("dragstart", (event: DragEvent) => {
            this.onDragStart(event);
        })
        this.element.addEventListener("dragend", (event: DragEvent) => {
            this.onDragEnd(event);
        })
        this.element.addEventListener("dragenter", (event: DragEvent) => {
            this.onDragEnter(event);
        })
        this.element.addEventListener("dragleave", (event: DragEvent) => {
            this.onDragLeave(event);
        })
    }

    // _는 받지 않는 함수
    onDragStart(_: DragEvent) {
        this.notifyDragObservers(`start`);
        this.element.classList.add("lifted");
    }
    onDragEnd(_: DragEvent) {
        this.notifyDragObservers(`stop`);
        this.element.classList.remove("lifted");
    }
    onDragEnter(_: DragEvent) {
        this.notifyDragObservers(`enter`);
        this.element.classList.add("drop-area");
    }
    onDragLeave(_: DragEvent) {
        this.notifyDragObservers(`leave`);
        this.element.classList.remove("drop-area");
    }

    notifyDragObservers(state: DragState) {
        this.dragStateListener && this.dragStateListener(this, state);
    }

    onDropped() {
        this.element.classList.remove("drop-area");
    }

    addChild(child: Component) {
        const container = this.element.querySelector(".page-item__body")! as HTMLElement;
        child.attachTo(container);
    }
    setOnCloseListener(listener: OnCloseListener) {
        this.closeListener = listener;
    }
    setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
        this.dragStateListener = listener;
    }

    muteChildren(state: "mute" | "unmute"): void {
        if (state === "mute") {
            this.element.classList.add("mute-children");
        }
        else {
            this.element.classList.remove("mute-children");
        }
    }

    getBoundingRect(): DOMRect {
        return this.element.getBoundingClientRect();
    }
}
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    // Set: 새로운 자료구조, 중복된 데이터를 가질 수 없음
    private children = new Set<SectionContainer>();
    private dragTarget?: SectionContainer;
    private dropTarget?: SectionContainer;

    constructor(private pageItemConstructor: SectionContainerConstructor) {
        super('<ul class="page"></ul>');
        // 굉장히 많이 호출 되기 때문에, 코드가 많이 복잡해지지 않지만 성능에 문제가 없도록 구현 필요
        this.element.addEventListener("dragover", (event: DragEvent) => {
            this.onDragOver(event);
        })
        this.element.addEventListener("drop", (event: DragEvent) => {
            this.onDrop(event);
        })
    }

    onDragOver(event: DragEvent) {
        // preventDefault 처리하지 않으면 브라우저에서 기본적으로 처리하는 터치이벤트/포인트 이벤트에서 예상치못한 처리가 될 수 있다
        event.preventDefault();
        console.log("onDragOver");

    }
    onDrop(event: DragEvent) {
        event.preventDefault();
        console.log("onDrop");
        // 여기에서 위치를 바꿔준다
        if (!this.dropTarget) {
            return;
        }
        else if (this.dragTarget && this.dragTarget !== this.dropTarget) {
            const dropY = event.clientY;
            const srcElement = this.dragTarget.getBoundingRect();
            this.dragTarget.removeFrom(this.element);
            this.dropTarget.attach(this.dragTarget, dropY < srcElement.y ? "beforebegin" : "afterend");
        }
        this.dropTarget.onDropped();
    }

    addChild(section: Component) {
        const item = new this.pageItemConstructor();
        item.addChild(section);
        item.attachTo(this.element, "beforeend");
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
            this.children.delete(item);
        });
        this.children.add(item);
        item.setOnDragStateListener((target: SectionContainer, state: DragState) => {
            switch (state) {
                case "start":
                    this.dragTarget = target;
                    this.updateSections(`mute`); // 드래그가 시작되면 모든 포인터를 mute한다
                    break;
                case "stop":
                    this.dragTarget = undefined;
                    this.updateSections(`unmute`); // 드래그가 끝나면 모든 포인터를 unmute한다
                    break;
                case "enter":
                    console.log("enter", target);
                    this.dropTarget = target;
                    break;
                case "leave":
                    console.log("leave", target);
                    this.dropTarget = undefined;
                    break;
                default:
                    throw new Error(`unsupported state: ${state}`)
            }
        });
    }

    private updateSections(state: "mute" | "unmute") {
        this.children.forEach((section: SectionContainer) => {
            section.muteChildren(state);
        })
    }
}