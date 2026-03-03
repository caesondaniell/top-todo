import { tasks } from "./task-mgr.js";

console.clear();
console.log("Howdy partner.")
console.log(tasks);
tasks.add("laundry", "chores", "low", "3/1/26", "towels and sheets");
console.log(tasks);
tasks.list[0].edit("priority", "high");
tasks.list[0].checkDue();
console.log(tasks.list[0]);
