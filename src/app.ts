import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { PageComponent, Composable, PageItemComponent } from "./components/page/page.js";
import { Component } from "./components/component.js";
import { InputDialog, MediaData, TextData } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

type InputComponentContructor<T = (MediaData | TextData) & Component> = {
    new(): T;
}

class App {
    private readonly page: Component & Composable;
    constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
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


        this.bindElementToDialog<MediaSectionInput>(
            "#new-image",
            MediaSectionInput,
            (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
        );

        this.bindElementToDialog<MediaSectionInput>(
            "#new-video",
            MediaSectionInput,
            (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
        );

        this.bindElementToDialog<TextSectionInput>(
            "#new-note",
            TextSectionInput,
            (input: TextSectionInput) => new NoteComponent(input.title, input.body)
        );

        this.bindElementToDialog<TextSectionInput>(
            "#new-todo",
            TextSectionInput,
            (input: TextSectionInput) => new TodoComponent(input.title, input.body)
        );
        // For demo
        this.page.addChild(new ImageComponent("Cool Picture", "https://picsum.photos/600/300"));
        this.page.addChild(new VideoComponent("New song!", "https://www.youtube.com/embed/fCO7f0SmrDc"));
        this.page.addChild(new NoteComponent("Note for Spanish Class", "Hola, me llamo Oscar :)"));
        this.page.addChild(new TodoComponent("Shopping List", "Blue Cheese"));
        this.page.addChild(new ImageComponent("Nice Picture", "https://picsum.photos/600/300"));
        this.page.addChild(new VideoComponent("Itaewon Halloween!", "youtube.com/watch?v=ZZLTZd0l_RA"));
        this.page.addChild(new NoteComponent("Note for TypeScript", "OOP is difficult"));
        this.page.addChild(new TodoComponent("To-Do List", "Don't forget to commit!"));
    }

    private bindElementToDialog<T extends (MediaData | TextData) & Component>(
        selector: string,
        InputComponent: InputComponentContructor<T>,
        makeSection: (input: T) => Component
    ) {

        const element = document.querySelector(selector)! as HTMLButtonElement;
        element.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new InputComponent();
            dialog.addChild(inputSection);
            dialog.attachTo(this.dialogRoot);

            dialog.setOnCloseListener(() => {
                dialog.removeFrom(this.dialogRoot);
            })

            dialog.setOnSubmitListener(() => {
                // TODO: 섹션을 만들어서 페이지에 추가해준다
                const element = makeSection(inputSection);
                this.page.addChild(element);
                dialog.removeFrom(this.dialogRoot);
            });
        });

    }
}
// 이런 경우에만 사용해야 하는 type assertion
new App(document.querySelector(".document")! as HTMLElement, document.body)