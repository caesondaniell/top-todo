import "./style.css";
import { tasks } from "./task-mgr.js";
import { renderPage } from "./dom-control.js";

console.clear();
console.log("Howdy partner.")
tasks.add("laundry", "chores", 3, "2026-05-01", "towels and sheets");
tasks.add("make doc appt", "health", 1, "2026-02-04", "sore throat");
tasks.add("wash car");
console.log(tasks.open);

renderPage();