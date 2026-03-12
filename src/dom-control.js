import { tasks } from "./task-mgr.js";

let displayedList = tasks.open;

const creator = {
    categoryLine: function(category = "") {
        const line = this.div();
        const p = this.p();
        const input = this.input();
        const edit = this.iconButton("edit", "rename category");
        const trash = this.iconButton("delete", "remove category");
        const accept = this.iconButton("done_outline", "accept changes");

        edit.setAttribute("data-function", "rename");
        trash.setAttribute("data-function", "trash");
        accept.setAttribute("data-function", "accept");

        p.classList.add("category-line-item");
        input.classList.add("category-line-item");
        edit.classList.add("category-line-item");
        trash.classList.add("category-line-item");
        accept.classList.add("category-line-item");

        input.hidden = true;
        trash.hidden = true;
        accept.hidden = true;

        p.textContent = category;
        input.value = p.textContent;

        line.append(p, edit, input, trash, accept);

        line.addEventListener("click", (e) => {
            const btn = e.target.closest(".icon-button");
            if (!btn) return;
            handleCategoryClick(btn);
        });

        line.addEventListener("keyup", (e) => {
            const focused = document.activeElement;
            if (focused === input && e.key === "Enter") handleCategoryClick(accept);
        });

        return line;
    },
    element: function(tag) { return document.createElement(tag) },
    formField: function(tag, title, type="undefined") {
        const label = this.label();
        const input = this[tag]();

        label.classList.add(title);
        label.setAttribute("for", title);

        input.setAttribute("id", title);
        if (tag === "input") input.setAttribute("type", type);

        label.textContent = title;

        label.append(input);

        return label;
    },
    icon: function(name) {
        const icon = this.span();

        icon.classList.add("material-symbols-outlined");
        icon.toggleAttribute("aria-hidden");
        icon.textContent = name;

        return icon;
    },
    iconButton: function(name, desc) {
        const button = this.button();
        const icon = this.icon(name);

        button.append(icon);

        button.setAttribute("aria-label", desc);
        button.classList.add("icon-button");

        return button;
    },
    menuOption: function(iconName, label) {
        const p = this.p();
        const icon = this.icon(iconName);

        p.textContent = ` ${label}`;
        p.prepend(icon);

        return p;
    },
    selectOptions: function(selector, choices) {
        const field = document.getElementById(selector);
        choices.forEach(choice => {
            const option = this.option();
            option.value = choice;
            option.textContent = choice;
            field.append(option);
        });
    },
};

const tags = [
    "button",
    "dialog",
    "div",
    "form",
    "h1",
    "h2",
    "h3",
    "input",
    "label",
    "option",
    "p",
    "select",
    "span",
    "textarea",
];

tags.forEach(tag => {
    creator[tag] = function() {
        return this.element(tag);
    };
});

const categoryEditor = (() => {
    const container = creator.dialog();
    const header = creator.div();
    const body = creator.div();
    const add = creator.iconButton("add", "add category");
    const done = creator.button();
    const title = creator.h2();

    container.classList.add("category-editor");
    body.classList.add("category-list");
    done.classList.add("done");

    title.textContent = "Task Categories";
    done.textContent = "done";

    done.addEventListener("click", () => container.close());
    add.addEventListener("click", () => {
        const newLine = creator.categoryLine();
        const items = newLine.querySelectorAll(".category-line-item");
        const input = newLine.querySelector("input");
        items.forEach(item => item.toggleAttribute("hidden"));
        body.appendChild(newLine);
        input.focus();
    });

    header.append(title, add);
    container.append(header, body, done);
    document.body.append(container);
})();

const taskBuilder = (() => {
    const container = creator.dialog();
    const taskForm = creator.form();
    const task = creator.formField("input", "task", "text");
    const taskField = task.querySelector("input");
    const due = creator.formField("input", "due", "date");
    const priority = creator.formField("select", "priority");
    const priorities = ["low", "medium", "high"];
    const category = creator.formField("select", "category");
    const categoryOption = creator.option();
    const categoryAdd = creator.input();
    const details = creator.formField("textarea", "details");
    const submitButton = creator.input();
    const closeButton = creator.iconButton("close", "close form");
    const or = creator.p();

    taskField.insertAdjacentText("beforebegin", '* (required)');
    taskField.required = true;

    container.classList.add("task-builder");

    categoryOption.value = "";
    categoryOption.textContent = "Select category";

    categoryAdd.id = "new-category";
    categoryAdd.placeholder = "New category";

    details.querySelector("textarea").autocapitalize = "sentences";

    submitButton.value = "add task";
    submitButton.type = "submit";

    or.append("or");

    closeButton.addEventListener("click", () => {
        if (confirm( "Close? Any data you've entered will be lost." )) {
            container.close();
            clearForm();
        };
    });
    submitButton.addEventListener("click", (e) => handleSubmit(e));

    category.querySelector("select").append(categoryOption);
    taskForm.append(task, due, priority, category, or, categoryAdd, details, submitButton);
    container.append(closeButton, taskForm);
    document.body.append(container);

    creator.selectOptions("priority", priorities);

    function clearCategoryOptions() {
        const options = category.querySelector("select")
                                .querySelectorAll("option");
        for (let i = options.length - 1; i > 0; i--) {
            options[i].remove();
        };
    }
    function clearForm() {
        task.querySelector("input").value = "";
        due.querySelector("input").value = "";
        priority.querySelector("select").value = "low";
        category.querySelector("select").value = "";
        categoryAdd.value = "";
        clearCategoryOptions();
        details.querySelector("textarea").value = "";
    }
    function handleSubmit(e) {
        const name = task.querySelector("input").value;
        const date = due.querySelector("input").value === "" ? undefined
                    : due.querySelector("input").value;
        const priorityLevel = priority.querySelector("select").value;
        const priorityCode = priorityLevel === "high" ? 1
                            :priorityLevel === "medium" ? 2
                            : 3;
        const kindSelection = category.querySelector("select").value;
        const kindAddition = categoryAdd.value;
        const kind = kindAddition !== "" ? kindAddition
                    :kindSelection !== "" ? kindSelection
                    : "general";
        const info = details.querySelector("textarea").value;

        if (name !== "") {
            e.preventDefault();
            tasks.add(name, kind, priorityCode, date, info);
            renderTabs();
            renderTasks();
            clearForm();
            container.close();
        }
    }
})();

const optionsMenu = (() => {
    const menu = creator.dialog();
    const newTask = creator.menuOption("assignment_add", "New Task");
    const editCategories = creator.menuOption("edit_square", "Edit Categories");
    const viewArchive = creator.menuOption("folder", "View Closed Tasks");
    
    menu.classList.add("options");
    
    newTask.addEventListener("click", () => {
        const taskBuilder = document.querySelector(".task-builder");
        const taskInput = document.getElementById("task");
        creator.selectOptions("category", tasks.categories.toSorted());
        taskBuilder.showModal();
        taskInput.focus();
        toggleMenu();
    });
    editCategories.addEventListener("click", () => {
        const categoryEditor = document.querySelector(".category-editor");
        const categoryList = categoryEditor.querySelector(".category-list");
        categoryList.innerHTML = "";
        tasks.categories.forEach(category => {
            const item = creator.categoryLine(category);
            categoryList.appendChild(item);
        });
        categoryEditor.showModal();
        toggleMenu();
    });
    viewArchive.addEventListener("click", () => {
        displayedList = tasks.closed;
        const tabs = document.querySelector(".tabs");
        tabs.querySelector(".active")?.classList.remove("active");
        renderTasks();
        toggleMenu();
    });

    menu.append(newTask, editCategories, viewArchive);
    document.body.append(menu);
})();



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
            const tab = creator.button();

            tab.textContent = category;
            tab.classList.add("list-tab");
            tab.setAttribute("data-category", category);

            tabs.append(tab);
        };
    });
}

function renderTasks() {
    const list = document.querySelector(".list-display");
    list.innerHTML = "";
    displayedList.forEach(task => {
        const card = creator.div();
        const title = creator.h3();
        const due = creator.p();
        const details = creator.p();
        const category = creator.p();

        card.setAttribute("class", `task-card ${task.status}`);
        title.classList.add("title");
        due.classList.add("due");
        details.classList.add("details");
        category.classList.add("category");

        title.textContent = task.name;
        due.textContent = task.formattedDueDate;
        details.textContent = task.details;
        category.textContent = task.category;

        card.append(title, due, details, category);
        list.append(card);
    });
}

export function renderPage() {
    const main = creator.div();
    const head = creator.div();
    const tabs = creator.div();
    const listDisplay = creator.div();
    const pageTitle = creator.h1();
    const menuButton = creator.iconButton("more_vert", "options");
    const allTab = creator.button();

    main.classList.add("main");
    head.classList.add("head");
    menuButton.classList.add("options-menu");
    tabs.classList.add("tabs");
    allTab.classList.add("list-tab");
    allTab.classList.add("active");
    listDisplay.classList.add("list-display");

    allTab.setAttribute("data-category", "all");

    pageTitle.textContent = "My To-Dos";
    allTab.textContent = "all tasks";

    menuButton.addEventListener("click", toggleMenu);
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

    head.append(pageTitle, menuButton);
    tabs.append(allTab);
    main.append(head, tabs, listDisplay);
    document.body.append(main);
    renderTabs();
    renderTasks();
}

function handleCategoryClick(btn) {
    const parent = btn.parentElement;
    const elements = parent.querySelectorAll(".category-line-item");

    switch (btn.dataset.function) {
        case "rename":
            elements.forEach(element => element.toggleAttribute("hidden"));
            elements[2].focus();
            break;
        case "trash":
            const label = elements[0].textContent;
            if (label === "general") {
                alert( "Can't delete the default category." );
                return;
            };
            if (confirm( "Delete this category? All associated tasks will be relabeled as 'general' tasks." )) {
                parent.remove();
                tasks.removeCategory(label);
                renderTabs();
                renderTasks();
            };
            break;
        case "accept":
            const oldLabel = elements[0].textContent;
            const newLabel = elements[2].value;
            if (oldLabel !== newLabel) {
                tasks.renameCategory(oldLabel, newLabel);
                elements[0].textContent = newLabel;
                renderTabs();
                renderTasks();
            };
            elements.forEach(element => element.toggleAttribute("hidden"));
            break;
    }
}

function handleOutsideClick(e) {
    const menu = document.querySelector(".options");
    const menuButton = document.querySelector(".options-menu");

    if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
        toggleMenu();
    };
}

function toggleMenu() {
    const menu = document.querySelector(".options");

    switch (menu.hasAttribute("open")) {
        case true:
            menu.close();
            document.removeEventListener("click", handleOutsideClick);
            break;
        case false:
            menu.show();
            setTimeout(() => {
                document.addEventListener("click", handleOutsideClick);
            }, 0);
            break;
    };
}