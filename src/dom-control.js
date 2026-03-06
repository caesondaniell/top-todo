import { tasks } from "./task-mgr.js";

let displayedList = tasks.open;
const createDiv = createElement("div");
const createModal = createElement("dialog");
const createH1 = createElement("h1");
const createH3 = createElement("h3");
const createPara = createElement("p");
const createSpan = createElement("span");
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
    const head = createDiv();
    const tabs = createDiv();
    const listDisplay = createDiv();
    const pageTitle = createH1();
    const menu = createButton();
    const menuIcon = createSpan();
    const allTab = createButton();
    
    main.classList.add("main");
    head.classList.add("head");
    menuIcon.classList.add("material-symbols-outlined")
    menu.classList.add("menu");
    tabs.classList.add("tabs");
    allTab.classList.add("list-tab");
    allTab.classList.add("active");
    listDisplay.classList.add("list-display");
    allTab.setAttribute("data-category", "all");
    pageTitle.textContent = "My To-Dos";
    menuIcon.textContent = "more_vert";
    allTab.textContent = "all tasks";
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
    menu.appendChild(menuIcon);
    head.appendChild(pageTitle);
    head.appendChild(menu);
    tabs.appendChild(allTab);
    main.appendChild(head);
    main.appendChild(tabs);
    main.appendChild(listDisplay);
    document.body.appendChild(main);
    renderTabs();
    renderTasks();
}