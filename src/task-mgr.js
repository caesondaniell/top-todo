// Need to read up on date-fns and cherry pick, for (at least) checkDue()
import { format, isPast, parseISO } from "date-fns";

const tasks = {
    list: [],
    categories: [],
    add(name, ...rest) {
        const [category, priority, due, details] = rest;
        this.list.push(new Task(name, category, priority, due, details));
        this.updateCategories();
    },
    updateCategories() {
        this.list.forEach(task => {
            if (!this.categories.includes(task.category)) {
                this.categories.push(task.category);
            };
        });
    },
    focusCategory(category) {
        if (!this.categories.includes(category)) return alert("Not in list!");
        const position = this.categories.indexOf(category);
        this.categories.splice(position, 1);
        this.categories.unshift(category);
    },
    printStatus() {
        this.list.forEach(task => {
            console.log(task.name, task.checkDue().toUpperCase());
        })
    }
};

class Task {
    constructor(name, category="general", priority="low", due=undefined, details=undefined) {
        this.name = name;
        this.category = category;
        this.priority = priority;
        this.due = due === undefined ? due : parseISO(due);
        this.details = details;
    }

    status = "yet to do";

    get formattedDueDate() {
        return format(this.due, 'PPPP');
    }

    edit(property, newValue) {
        this[property] = property === "due" ? parseISO(newValue) : newValue;
    }

    checkDue() {
        if (isPast(this.due)) {
            this.status = "overdue";
        }
        return this.status;
    }

    remove() {
        const position = tasks.list.indexOf(this);
        tasks.list.splice(position, 1);
    }
}

export { tasks };