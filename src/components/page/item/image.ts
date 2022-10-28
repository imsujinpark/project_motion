export class ImageComponent {
    private element: HTMLElement;
    constructor(title: string, url: string) {
        const template = document.createElement("template");
        template.innerHTML = `<section class="image">
        <div class="image__holder">
            <img class="image__thumbnail">
        </div>
        <p class="image__title"></p>
    </section>`
        this.element = template.content.firstElementChild! as HTMLElement; // section 안 내용 element가 있을 수도 있고 null 일수도 있지만 여기선 null 아닌걸 우리가 암(!)

        const imageElement = this.element.querySelector(".image__thumbnail")! as HTMLImageElement; // null이 아닌 걸 우리가 아니 image element로 캐스팅
        imageElement.src = url;
        imageElement.alt = title;

        const titleElement = this.element.querySelector(".image__title")! as HTMLParagraphElement;
        titleElement.textContent = title;
    }
    // 기본값은 afterbegin
    attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
        parent.insertAdjacentElement(position, this.element)
    }
}