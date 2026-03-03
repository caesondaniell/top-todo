import { tasks } from "./task-mgr.js";

console.clear();
console.log("Howdy partner.")
tasks.add("laundry", "chores", "low", "2026-03-01", "towels and sheets");
tasks.add("make doc appt", "health", "high", "2026-03-04", "sore throat");
console.log(tasks);
tasks.printStatus();
tasks.add("wash car");
console.log(tasks.list[0].due);
console.log(tasks.list[0].formattedDueDate);