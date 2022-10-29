import { BaseComponent } from "../../component.js";

export class VideoComponent extends BaseComponent<HTMLElement> {
    // 사용자는 우리한테 url만 전달하면 됨
    constructor(title: string, url: string) {
        super(`<section class="video">
                    <div class="video__player"><iframe class="video__iframe"></iframe></div>
                    <h3 class="page-item__title video__title"></h3>
                </section>`)

        const iframe = this.element.querySelector('.video__iframe')! as HTMLIFrameElement;
        iframe.src = this.convertToEmbeddedURL(url) // url -> videoId -> embed

        const titleElement = this.element.querySelector('.video__title')! as HTMLHeadingElement;
        titleElement.textContent = title;
    }

    // 사용자가 주소창 url - https://www.youtube.com/watch?v=fCO7f0SmrDc
    // 사용자가 copy embedded url 들고 오는 것 - https://www.youtube.com/embed/fCO7f0SmrDc

    private convertToEmbeddedURL = (url: string): string => {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-_]{11}))|(?:youtu.be\/([a-zA-Z0-9-_]{11})))/;
        const match = url.match(regExp);
        console.log(match);

        const videoId = match ? match[1] || match[2] : undefined;
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        else {
            return url;
        }
    }
}