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
    document.querySelectorAll(".list-tab").forEach(btn => {
        const label = btn.dataset.category;
        if (label !== "all" && !tasks.categories.includes(label)) {
            btn.remove();
        };
    });
    const currBtns = [...document.querySelectorAll(".list-tab")]
                        .map(btn => btn.dataset.category);
    tasks.categories.forEach(category => {
        if (!currBtns.includes(category)) {
            const tab = createButton();
            tab.textContent = category;
            tab.classList.add("list-tab");
            tab.setAttribute("data-category", category);
            tabs.appendChild(tab);
        };
    });
}

function renderTasks() {
    const list = document.querySelector(".list-display");
    list.innerHTML = "";
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
    const allTab = createButton();
    const listDisplay = createDiv();
    main.classList.add("main");
    tabs.classList.add("tabs");
    allTab.classList.add("list-tab");
    allTab.classList.add("active");
    listDisplay.classList.add("list-display");
    allTab.setAttribute("data-category", "all");
    pageTitle.textContent = "My To-Dos";
    allTab.textContent = "all tasks"
    tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".list-tab");
        const category = btn.dataset.category;
        if (!btn) return;
        tabs.querySelector(".active")?.classList.remove("active");
        btn.classList.add("active");
        if (category === "all") {
            displayedList = tasks.open;
        } else {
            displayedList = tasks.open.filter((t) => t.category === category);
        }
        renderTasks();
    });
    tabs.appendChild(allTab);
    main.appendChild(pageTitle);
    main.appendChild(tabs);
    main.appendChild(listDisplay);
    document.body.appendChild(main);
    renderTabs();
    renderTasks();
}