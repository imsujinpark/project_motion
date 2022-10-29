import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { PageComponent, Composable, PageItemComponent } from "./components/page/page.js";
import { Component } from "./components/component.js";

class App {
    private readonly page: Component & Composable;
    constructor(appRoot: HTMLElement) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);

        const image = new ImageComponent("Image Title", "https://picsum.photos/600/300");
        this.page.addChild(image);

        const video = new VideoComponent("Video Title", "https://www.youtube.com/embed/fCO7f0SmrDc");
        this.page.addChild(video);

        const note = new NoteComponent("Note Title", "Note Body");
        this.page.addChild(note);

        const todo = new TodoComponent("Todo Title", "Todo Item");
        this.page.addChild(todo);
    }
}
// 이런 경우에만 사용해야 하는 type assertion
new App(document.querySelector(".document")! as HTMLElement)