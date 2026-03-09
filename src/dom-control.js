import { tasks } from "./task-mgr.js";

let displayedList = tasks.open;

const createButton = createElement("button");
const createDiv = createElement("div");
const createH1 = createElement("h1");
const createH2 = createElement("h2");
const createH3 = createElement("h3");
const createInput = createElement("input");
const createLink = createElement("a");
const createList = createElement("ul");
const createListItem = createElement("li");
const createModal = createElement("dialog");
const createPara = createElement("p");
const createSpan = createElement("span");

const categoryEditor = (() => {
    const container = createModal();
    const header = createDiv();
    const body = createDiv();
    const add = createIconButton("add", "add category");
    const done = createButton();
    const title = createH2();
    container.classList.add("category-editor");
    body.classList.add("category-list");
    done.classList.add("done");
    title.textContent = "Task Categories";
    done.textContent = "done";
    done.addEventListener("click", () => container.close());
    add.addEventListener("click", () => {
        const newLine = createCategoryLine();
        const items = newLine.querySelectorAll(".category-line-item");
        const input = newLine.querySelector("input");
        items.forEach(item => item.toggleAttribute("hidden"));
        input.focus();
        body.appendChild(newLine);
    });
    header.appendChild(title);
    header.appendChild(add);
    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(done);
    document.body.appendChild(container);
})();

const optionsMenu = (() => {
    const container = createModal();
    const newTask = createOption("assignment_add", "New Task");
    const editCategories = createOption("edit_square", "Edit Categories");
    const viewArchive = createOption("folder", "View Closed Tasks");
    container.classList.add("options");
    viewArchive.addEventListener("click", () => {
        displayedList = tasks.closed;
        const tabs = document.querySelector(".tabs");
        tabs.querySelector(".active")?.classList.remove("active");
        renderTasks();
        toggleOptions();
    });
    editCategories.addEventListener("click", () => {
        const categoryModal = document.querySelector(".category-editor");
        const categoryList = categoryModal.querySelector(".category-list");
        categoryList.innerHTML = "";
        tasks.categories.forEach(category => {
            const item = createCategoryLine(category);
            categoryList.appendChild(item);
        });
        categoryModal.showModal();
    });
    container.appendChild(newTask);
    container.appendChild(editCategories);
    container.appendChild(viewArchive);
    document.body.appendChild(container);
})();

function createCategoryLine(category = "") {
    const line = createDiv();
    const p = createPara();
    const input = createInput();
    const edit = createIconButton("edit", "rename category");
    const trash = createIconButton("delete", "remove category");
    const accept = createIconButton("done_outline", "accept changes");
    edit.setAttribute("data-function", "rename");
    trash.setAttribute("data-function", "trash");
    accept.setAttribute("data-function", "accept");
    p.classList.add("category-line-item");
    input.classList.add("category-line-item");
    edit.classList.add("category-line-item");
    trash.classList.add("category-line-item");
    accept.classList.add("category-line-item");
    input.toggleAttribute("hidden");
    trash.toggleAttribute("hidden");
    accept.toggleAttribute("hidden");
    p.textContent = category;
    input.value = p.textContent;
    line.appendChild(p);
    line.appendChild(edit);
    line.appendChild(input);
    line.appendChild(trash);
    line.appendChild(accept);
    // line.addEventListener("click", (e) => {
    //     const btn = e.target.closest(".icon-button");
    //     if (!btn) return;
    //     handleCategoryClick(btn.dataset.function);
    // })
    return line;
}

function createElement(element) {
    return () => {
        return document.createElement(element);
    }
}

function createIcon(name) {
    const icon = createSpan();
    icon.classList.add("material-symbols-outlined");
    icon.toggleAttribute("aria-hidden");
    icon.textContent = name;
    return icon;
}

function createIconButton(name, desc) {
    const button = createButton();
    const icon = createIcon(name);
    button.appendChild(icon);
    button.setAttribute("aria-label", desc);
    button.classList.add("icon-button");
    return button;
}

function createOption(iconName, label) {
    const p = createPara();
    const icon = createIcon(iconName);
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
    const options = createIconButton("more_vert", "options");
    const allTab = createButton();
    main.classList.add("main");
    head.classList.add("head");
    options.classList.add("options-menu");
    tabs.classList.add("tabs");
    allTab.classList.add("list-tab");
    allTab.classList.add("active");
    listDisplay.classList.add("list-display");
    allTab.setAttribute("data-category", "all");
    pageTitle.textContent = "My To-Dos";
    allTab.textContent = "all tasks";
    options.addEventListener("click", toggleOptions);
    tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".list-tab");
        if (!btn) return;
        const category = btn.dataset.category;
        tabs.querySelector(".active")?.classList.remove("active");
        btn.classList.add("active");
        if (category === "all") {
            displayedList = tasks.open;
        } else {
            displayedList = tasks.open.filter((t) => t.category === category);
        }
        renderTasks();
    });
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