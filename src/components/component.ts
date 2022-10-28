export interface Component {
    attachTo(parent: HTMLElement, position?: InsertPosition): void;
    removeFrom(parent: HTMLElement): void;
}

/**
 * Encapsulate the HTML element creation
 * BaseComponent 사용할 때 조금 더 다양한 HTML Subcomponent를 사용할 수 있도록 Generic 사용
 */
export class BaseComponent<T extends HTMLElement> implements Component {
    protected readonly element: T; // 자식컴포넌트에서만 접근 가능하고, 한번 만들어지면 읽기만 가능하도록
    constructor(htmlString: string) {
        const template = document.createElement("template");
        template.innerHTML = htmlString;
        this.element = template.content.firstElementChild! as T;
    }

    attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
        parent.insertAdjacentElement(position, this.element)
    }

    removeFrom(parent: HTMLElement) {
        // 조금더 안전하게 작성하기
        if (parent !== this.element.parentElement) {
            throw new Error("Parent mismatch!");
        }
        parent.removeChild(this.element);
    }
}