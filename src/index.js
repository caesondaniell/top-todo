import { tasks } from "./task-mgr.js";

console.clear();
console.log("Howdy partner.")
tasks.add("laundry", "chores", "low", "2026-03-01", "towels and sheets");
tasks.add("make doc appt", "health", "high", "2026-03-04", "sore throat");
tasks.add("wash car");
// console.log(tasks);
// tasks.printStatus();
// console.log(tasks.categories);
// tasks.focusCategory("health");
// console.log(tasks.categories);
tasks.open[2].complete();
console.log(tasks.open, tasks.closed);
tasks.closed[0].unarchive();
tasks.printStatus();