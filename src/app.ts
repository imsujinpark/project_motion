import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { PageComponent, Composable, PageItemComponent } from "./components/page/page.js";
import { Component } from "./components/component.js";
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

class App {
    private readonly page: Component & Composable;
    constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);

        // 수동적으로 추가해주는 코드
        // const image = new ImageComponent("Image Title", "https://picsum.photos/600/300");
        // this.page.addChild(image);

        // const video = new VideoComponent("Video Title", "https://www.youtube.com/embed/fCO7f0SmrDc");
        // this.page.addChild(video);

        // const note = new NoteComponent("Note Title", "Note Body");
        // this.page.addChild(note);

        // const todo = new TodoComponent("Todo Title", "Todo Item");
        // this.page.addChild(todo);

        const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
        imageBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new MediaSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            })

            dialog.setOnSubmitListener(() => {
                // TODO: 섹션을 만들어서 페이지에 추가해준다
                const image = new ImageComponent(inputSection.title, inputSection.url);
                this.page.addChild(image);
                dialog.removeFrom(dialogRoot);
            });
        });

        const videoBtn = document.querySelector("#new-video")! as HTMLButtonElement;
        videoBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new MediaSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            })

            dialog.setOnSubmitListener(() => {
                // TODO: 섹션을 만들어서 페이지에 추가해준다
                const video = new VideoComponent(inputSection.title, inputSection.url);
                this.page.addChild(video);
                dialog.removeFrom(dialogRoot);
            });
        });

        const noteBtn = document.querySelector("#new-note")! as HTMLButtonElement;
        noteBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new TextSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            })

            dialog.setOnSubmitListener(() => {
                // TODO: 섹션을 만들어서 페이지에 추가해준다
                const note = new NoteComponent(inputSection.title, inputSection.body);
                this.page.addChild(note);
                dialog.removeFrom(dialogRoot);
            })
        });

        const todoBtn = document.querySelector("#new-todo")! as HTMLButtonElement;
        todoBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new TextSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListener(() => {
                dialog.removeFrom(dialogRoot);
            })

            dialog.setOnSubmitListener(() => {
                // TODO: 섹션을 만들어서 페이지에 추가해준다
                const todo = new TodoComponent(inputSection.title, inputSection.body);
                this.page.addChild(todo);
                dialog.removeFrom(dialogRoot);
            })
        });
    }
}
// 이런 경우에만 사용해야 하는 type assertion
new App(document.querySelector(".document")! as HTMLElement, document.body)