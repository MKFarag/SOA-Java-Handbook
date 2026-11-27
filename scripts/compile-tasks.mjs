import { compileAllTasks } from './compile-tasks-lib.mjs';

const { tasks, outPath, topicCount, warnings } = compileAllTasks(process.cwd());
const totalLinks = tasks.reduce(
  (sum, task) => sum + task.steps.reduce((s, step) => s + step.links.length, 0),
  0
);
console.log(
  `Compiled ${tasks.length} task(s) (${totalLinks} step links across ${topicCount} handbook topics) -> ${outPath}`
);
if (warnings.length > 0) {
  for (const warning of warnings) {
    console.warn(`[WARN] ${warning}`);
  }
}
