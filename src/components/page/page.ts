import { BaseComponent, Component } from "../component.js";

export interface Composable {
    addChild(child: Component): void;
}

type OnCloseListener = () => void;

// Component와 Composable 관련된 모든 것들이 구현됨
interface SectionContainer extends Component, Composable {
    setOnCloseListener(lister: OnCloseListener): void;
}

type SectionContainerConstructor = {
    // 아무 것도 받지 않는 생성자가 있고 SectionContainer를 만드는 그 어떤 class는 다 괜찮다
    new(): SectionContainer
}

export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer {
    private closeListener?: OnCloseListener;
    constructor() {
        super(`<li class="page-item">
                     <section class="page-item__body"></section>
                    <div class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </li>`);
        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.onclick = () => {
            this.closeListener && this.closeListener();
        }
    }
    addChild(child: Component) {
        const container = this.element.querySelector(".page-item__body")! as HTMLElement;
        child.attachTo(container);
    }
    setOnCloseListener(listner: OnCloseListener) {
        this.closeListener = listner;
    }
}
export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    constructor(private pageItemConstructor: SectionContainerConstructor) {
        super('<ul class="page"></ul>')
    }

    addChild(section: Component) {
        const item = new this.pageItemConstructor();
        item.addChild(section);
        item.attachTo(this.element, "beforeend");
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
        })
    }
}