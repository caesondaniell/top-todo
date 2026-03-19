import { 
    compareAsc,
    compareDesc,
    format,
    formatISO,
    isPast,
    parseISO 
} from "date-fns";

const tasks = {
    categories: [],

    closed: [],

    open: [],

    orgRules: {
        date: (a, b) => {
            if (!a.due && !b.due) return 0;
            if (!a.due) return 1;
            if (!b.due) return -1;
            return compareAsc(a.due, b.due);
        },
        priority: (a, b) => a.priority - b.priority,
    },

    add(name, ...rest) {
        const [category, priority, due, details] = rest;
        this.open.push(new Task(name, category, priority, due, details));
        this.updateCategories(this.open.at(-1));
        this.organize(this.open);
        this.save();
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
        this.save();
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
        list.sort((a, b) => {
            return this.orgRules.date(a, b) || this.orgRules.priority(a, b);
        });
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
            this.save();
            return;
        }
        this.categories.splice(position, 1, newLabel);
        this.changeLabel(oldLabel, newLabel);
    },

    save() {
        if (!storageAvailable("localStorage")) return;
        localStorage.setItem("open", store(this.open));
        localStorage.setItem("closed", store(this.closed));
        localStorage.setItem("categories", store(this.categories));
    },

    updateCategories({ category }) {
        if (!this.categories.includes(category)) {
            this.categories.push(category);
        };
        this.save();
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

    get dueString() {
        return this.due !== undefined ? format(this.due, 'PPPP') : "";
    }

    get dueISO() {
        return this.due !== undefined ? formatISO(this.due, {representation: 'date'}) : "";
    }

    get status() {
        if (this.#status !== null) return this.#status;
        return isPast(this.due) ? "overdue" : "undone";
    }

    get toJSON() {
        return JSON.stringify([
            this.name,
            this.category,
            this.priority,
            this.dueISO,
            this.details
        ]);
    }

    set status(entry) {
        this.#status = entry;
    }

    archive() {
        this.trash();
        tasks.closed.push(this);
        tasks.organize(tasks.closed);
        tasks.save();
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
        tasks.save();
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
        tasks.save();
    }

    whosMyDad() {
        const lists = [tasks.open, tasks.closed];
        return lists.find(list => list.includes(this));
    }
}

function store(list) {
    if (typeof list[0] === "string") return JSON.stringify(list);
    const data = [];
    list.forEach(item => data.push(item.toJSON));
    return JSON.stringify(data);
}

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

export { tasks };