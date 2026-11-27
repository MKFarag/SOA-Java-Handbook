import type { TaskLogEntry } from '../types';
import { MAIN_SECTIONS } from './topics';
import rawTasks from './generated-tasks.json';

const taskImageModules = import.meta.glob<string>(
  '../../content/tasks/*/images/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP,GIF,SVG}',
  { eager: true, import: 'default' }
);

export function resolveTaskImageUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  const normalized = src.replace(/^\.\//, '');
  const moduleKey = `../../content/tasks/${normalized}`;
  return taskImageModules[moduleKey] || src;
}

export const TASK_LOG_ITEMS: TaskLogEntry[] = (rawTasks as unknown as TaskLogEntry[]).map(task => ({
  ...task,
  steps: task.steps.map(step => ({
    ...step,
    ...(step.blocks
      ? {
          blocks: step.blocks.map(block =>
            block.type === 'image'
              ? { ...block, src: resolveTaskImageUrl(block.src) }
              : block
          )
        }
      : {})
  }))
}));

export const TASK_TOPICS: string[] = MAIN_SECTIONS.map(sec => sec.label);
