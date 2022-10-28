import { PageComponent } from "./components/page.js";

class App {
    private readonly page: PageComponent;
    constructor(appRoot: HTMLElement) {
        this.page = new PageComponent();
        this.page.attachTo(appRoot)
    }
}
// 이런 경우에만 사용해야 하는 type assertion
new App(document.querySelector(".document")! as HTMLElement)