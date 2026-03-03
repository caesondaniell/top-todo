// Need to read up on date-fns and cherry pick, for (at least) checkDue()
import { format, isPast, parseISO } from "date-fns";

const tasks = {
    list: [],
    categories: [],
    add(name, ...rest) {
        const [category, priority, due, details] = rest;
        if (!this.categories.includes(category)) {
            this.categories.push(category);
        };
        this.list.push(new Task(name, category, priority, due, details));
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
        this.due = due === undefined ? due : new Date(due);
        this.details = details;
    }

    status = "yet to do";

    edit(property, newValue) {
        this[property] = property === "due" ? new Date(newValue) : newValue;
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