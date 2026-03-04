import { tasks } from "./task-mgr.js";

console.clear();
console.log("Howdy partner.")
tasks.add("laundry", "chores", "low", "2026-05-01", "towels and sheets");
tasks.add("make doc appt", "health", "high", "2026-02-04", "sore throat");
tasks.add("wash car");
console.log(tasks.open);