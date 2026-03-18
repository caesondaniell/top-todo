import { 
    compareAsc,
    compareDesc,
    format,
    isPast,
    parseISO,
    formatISO 
} from "date-fns";

const tasks = {
    categories: [],

    closed: [],

    open: [],

    add(name, ...rest) {
        const [category, priority, due, details] = rest;
        this.open.push(new Task(name, category, priority, due, details));
        this.updateCategories(this.open.at(-1));
        this.organize(this.open);
    },

    arrangeByDue(list, option = "asc") {
        if (option === "desc") {
            list.sort((a, b) => compareDesc(a.due, b.due));
            return;
        };
        list.sort((a, b) => compareAsc(a.due, b.due));
    },

    arrangeByPriority(list) {
        list.sort((a, b) => a.priority - b.priority);
    },

    changeLabel(oldLabel, newLabel) {
        this.open.forEach(task => {
            if (task.category === oldLabel) task.category = newLabel;
        });
        this.closed.forEach(task => {
            if (task.category === oldLabel) task.category = newLabel;
        });
    },

    focusCategory(category) {
        if (!this.categories.includes(category)) {
            console.log(`'${category}' isn't on the categories list`);
            return;
        };
        const position = this.categories.indexOf(category);
        this.categories.splice(position, 1);
        this.categories.unshift(category);
    },

    organize(list) {
        this.arrangeByPriority(list);
        this.arrangeByDue(list);
    },

    printStatus() {
        this.open.forEach(task => {
            console.log(task.name, task.status.toUpperCase());
        })
    },

    removeCategory(category) {
        const position = tasks.categories.indexOf(category);
        tasks.categories.splice(position, 1);
        this.changeLabel(category, "general");
    },

    renameCategory(oldLabel, newLabel) {
        const position = this.categories.indexOf(oldLabel);
        if (oldLabel === "") {
            this.categories.push(newLabel);
            return;
        }
        this.categories.splice(position, 1, newLabel);
        this.changeLabel(oldLabel, newLabel);
    },

    updateCategories({ category }) {
        if (!this.categories.includes(category)) {
            this.categories.push(category);
        };
    },
};

class Task {
    constructor(name, category="general", priority=3, due=undefined, details=undefined) {
        this.name = name;
        this.category = category;
        this.priority = priority;
        this.due = due === undefined ? due : parseISO(due);
        this.details = details;
    }

    created = new Date();

    #status = null;

    get displayDue() {
        return this.due !== undefined ? format(this.due, 'PPPP') : "";
    }

    get selectorDue() {
        return this.due !== undefined ? formatISO(this.due, {representation: 'date'}) : "";
    }

    get status() {
        if (this.#status !== null) return this.#status;
        return isPast(this.due) ? "overdue" : "undone";
    }

    set status(entry) {
        this.#status = entry;
    }

    archive() {
        this.trash();
        tasks.closed.push(this);
        tasks.organize(tasks.closed);
    }

    complete() {
        this.status = "done";
        this.archive();
    }

    edit(property, newValue) {
        this[property] = property === "due" && newValue === "" ? undefined
                       : property === "due" ? parseISO(newValue) 
                       : newValue;
        tasks.organize(tasks.open);
    }

    trash() {
        const parent = this.whosMyDad();
        const position = parent.indexOf(this);
        parent.splice(position, 1);
    }

    unarchive() {
        this.trash();
        tasks.open.push(this);
        this.status = null;
        tasks.organize(tasks.open);
    }

    whosMyDad() {
        const lists = [tasks.open, tasks.closed];
        return lists.find(list => list.includes(this));
    }
}

export { tasks };