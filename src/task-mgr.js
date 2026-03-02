// Need to read up on date-fns and cherry pick, for (at least) checkDueDate()
// import { } from "date-fns";

const taskList = [];

class Task {
    constructor(name, category="default", priority="low", dueDate=undefined, details=undefined) {
        this.name = name;
        this.category = category;
        this.priority = priority;
        this.dueDate = dueDate;
        this.status = "yet to do";
        this.details = details;
    }

    edit(property, newValue) {
        this[property] = newValue;
    }

    checkDueDate() {
        const currDate = new Date();
        if (currDate > this.dueDate) this.status = "overdue";
    }
}

function createTask(name, ...rest) {
    const [category, priority, dueDate, details] = rest;
    const task = new Task(name, category, priority, dueDate, details);
    taskList.push(task);
}

export { taskList, createTask };