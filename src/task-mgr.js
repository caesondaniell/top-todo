import { compareAsc, compareDesc, format, isPast, parseISO } from "date-fns";

const tasks = {
    categories: [],

    closed: [],

    open: [],

    add(name, ...rest) {
        const [category, priority, due, details] = rest;
        this.open.push(new Task(name, category, priority, due, details));
        this.updateCategories(this.open.at(-1));
        this.arrangeByPriority();
        this.arrangeByDue();
    },

    arrangeByDue(option = "asc") {
        if (option === "desc") {
            this.open.sort((a, b) => compareDesc(a.due, b.due));
            return;
        };
        this.open.sort((a, b) => compareAsc(a.due, b.due));
    },

    arrangeByPriority() {
        this.open.sort((a, b) => a.priority - b.priority);
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

    printStatus() {
        this.open.forEach(task => {
            console.log(task.name, task.status.toUpperCase());
        })
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

    get formattedDueDate() {
        return this.due !== undefined ? format(this.due, 'PPPP') : "";
    }

    get status() {
        if (this.#status !== null) return this.#status;
        return isPast(this.due) ? "overdue" : "yet to do";
    }

    set status(entry) {
        this.#status = entry;
    }

    archive() {
        this.trash();
        tasks.closed.push(this);
    }

    complete() {
        this.status = "did the do";
        this.archive();
    }

    edit(property, newValue) {
        this[property] = property === "due" ? parseISO(newValue) : newValue;
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
    }

    whosMyDad() {
        const lists = [tasks.open, tasks.closed];
        return lists.find(list => list.includes(this));
    }
}

export { tasks };