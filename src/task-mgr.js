// Need to read up on date-fns and cherry pick, for (at least) checkDue()
import { format, isAfter } from "date-fns";

const formattedDate = (date) => format(new Date(date), 'PPPP');

const tasks = {
    list: [],
    categories: [],
    add(name, ...rest) {
        const [category, priority, due, details] = rest;
        if (!this.categories.includes(category)) {
            this.categories.push(category);
        };
        const task = this.list
                        .push(new Task(name, category, priority, due, details));
    },
};

class Task {
    constructor(name, category="general", priority="low", due=undefined, details=undefined) {
        this.name = name;
        this.category = category;
        this.priority = priority;
        this.due = due === undefined ? due : formattedDate(due);
        this.details = details;
    }

    status = "yet to do";

    edit(property, newValue) {
        this[property] = property === "due" ? 
                        formattedDate(newValue) : newValue;
    }

    checkDue() {
        const currDate = format(new Date(), 'PPPP');
        console.log(isAfter(currDate, this.due));
    }
}

export { tasks };