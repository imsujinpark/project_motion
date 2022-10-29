import { BaseComponent, Component } from "../component.js";
import { Composable } from "../page/page.js";

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export interface MediaData {
    readonly title: string;
    readonly url: string;
}

export interface TextData {
    readonly title: string;
    readonly body: string;
}
// closeListener와 submitListener를 외부로 전달 받아서 등록된 listener가 있다면 실행해줄 것
export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
    closeListener?: OnCloseListener;
    submitListener?: OnSubmitListener;

    constructor() {
        super(`<dialog class="dialog">
                    <div class="dialog__container">
                        <button class="close">&times;</button>
                        <div id="dialog__body"></div>
                        <button class="dialog__submit">ADD</button>
                    </div>
                </dialog>`)

        // const dialogContainer = this.element.querySelector(".dialog__container")! as HTMLElement;
        // dialogContainer.onclick = (event: any) => {
        //     // const target = event.target as Element;
        //     if (!event.target.matches(".dialog__container")) return;
        //     this.closeListener && this.closeListener();
        // }

        const closeBtn = this.element.querySelector(".close")! as HTMLElement;
        // closeBtn.addEventListener("click", ""); // 버튼을 다른곳에서도 사용한다면 이렇게 구현하는게 낫다.
        closeBtn.onclick = () => {
            this.closeListener && this.closeListener();
        }

        const submitBtn = this.element.querySelector(".dialog__submit")! as HTMLElement;
        submitBtn.onclick = () => {
            this.submitListener && this.submitListener();
        }
    }
    setOnCloseListener(listener: OnCloseListener) {
        this.closeListener = listener;
    }
    setOnSubmitListener(listener: OnSubmitListener) {
        this.submitListener = listener;
    }
    addChild(child: Component) {
        const body = this.element.querySelector("#dialog__body")! as HTMLElement;
        child.attachTo(body);
    }
}