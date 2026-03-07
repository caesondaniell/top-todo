import { tasks } from "./task-mgr.js";

let displayedList = tasks.open;

const createButton = createElement("button");
const createDiv = createElement("div");
const createH1 = createElement("h1");
const createH3 = createElement("h3");
const createLink = createElement("a");
const createList = createElement("ul");
const createListItem = createElement("li");
const createModal = createElement("dialog");
const createPara = createElement("p");
const createSpan = createElement("span");

const optionsMenu = (() => {
    const container = createModal();
    const newTask = createOption("assignment_add", "New Task");
    const editCategories = createOption("edit_square", "Edit Categories");
    const viewArchive = createOption("folder", "View Closed Tasks");
    container.classList.add("options");
    container.appendChild(newTask);
    container.appendChild(editCategories);
    container.appendChild(viewArchive);
    document.body.appendChild(container);
})()

function createElement(element) {
    return () => {
        return document.createElement(element);
    }
}

function createIcon() {
    const icon = createSpan();
    icon.classList.add("material-symbols-outlined");
    icon.toggleAttribute("aria-hidden");
    return icon;
}

function createOption(iconName, label) {
    const p = createPara();
    const icon = createIcon();
    icon.textContent = iconName;

    p.textContent = ` ${label}`;
    p.prepend(icon);
    return p;
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
    const options = createButton();
    const optionsIcon = createIcon();
    const allTab = createButton();
    main.classList.add("main");
    head.classList.add("head");
    options.classList.add("options-menu");
    tabs.classList.add("tabs");
    allTab.classList.add("list-tab");
    allTab.classList.add("active");
    listDisplay.classList.add("list-display");
    options.setAttribute("aria-label", "list options");
    allTab.setAttribute("data-category", "all");
    pageTitle.textContent = "My To-Dos";
    optionsIcon.textContent = "more_vert";
    allTab.textContent = "all tasks";
    optionsIcon.addEventListener("click", toggleOptions);
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
    options.appendChild(optionsIcon);
    head.appendChild(pageTitle);
    head.appendChild(options);
    tabs.appendChild(allTab);
    main.appendChild(head);
    main.appendChild(tabs);
    main.appendChild(listDisplay);
    document.body.appendChild(main);
    renderTabs();
    renderTasks();
}

function handleOutsideClick(e) {
    const options = document.querySelector(".options");
    const optionsButton = document.querySelector(".options-menu");

    if (!options.contains(e.target) && !optionsButton.contains(e.target)) {
        toggleOptions();
    };
}

function toggleOptions() {
    const options = document.querySelector(".options");
    switch (options.hasAttribute("open")) {
        case true:
            options.close();
            document.removeEventListener("click", handleOutsideClick);
            break;
        case false:
            options.show();
            setTimeout(() => {
                document.addEventListener("click", handleOutsideClick);
            }, 0);
            break;
    };
}