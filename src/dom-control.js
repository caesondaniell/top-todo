import { tasks } from "./task-mgr.js";

let displayedList = tasks.open;
const createDiv = createElement("div");
const createH1 = createElement("h1");
const createH3 = createElement("h3");
const createPara = createElement("p");
const createButton = createElement("button");
const createLink = createElement("a");

function createElement(element) {
    return () => {
        return document.createElement(element);
    }
}

function renderTabs() {
    const tabs = document.querySelector(".tabs");
    tasks.categories.forEach(category => {
        const tab = createButton();
        tab.textContent = category;
        tab.classList.add("list-tab");
        tab.addEventListener("click", () => {
            displayedList = tasks.open.filter(task => {
                task.category === category;
            });
            const list = document.querySelector(".list-display");
            list.innerHTML = "";
            renderTasks();
        })
        tabs.appendChild(tab);
    });
}

function renderTasks() {
    const list = document.querySelector(".list-display");
    displayedList.forEach(task => {
        const card = createDiv();
        const title = createH3();
        const due = createPara();
        const details = createPara();
        const category = createPara();
        card.setAttribute("class", `task ${task.status}`);
        title.classList.add("title");
        due.classList.add("due");
        details.classList.add("details");
        category.classList.add("category");
        title.textContent = task.name;
        due.textContent = task.formattedDueDate;
        details.textContent = task.details;
        category.textContent = task.category;
        card.appendChild(title);
        card.appendChild(due);
        card.appendChild(details);
        card.appendChild(category);
        list.appendChild(card);
    });
}

export function renderPage() {
    const main = createDiv();
    const pageTitle = createH1();
    const tabs = createDiv();
    const listDisplay = createDiv();
    main.classList.add("main");
    tabs.classList.add("tabs");
    listDisplay.classList.add("list-display");
    pageTitle.textContent = "My To-Dos";
    main.appendChild(pageTitle);
    main.appendChild(tabs);
    main.appendChild(listDisplay);
    document.body.appendChild(main);
    renderTabs();
    renderTasks();
}