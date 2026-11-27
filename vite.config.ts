import { execFileSync } from 'node:child_process'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function taskLogCompilerPlugin(): Plugin {
  const tasksDir = path.resolve('content/tasks');
  const compileScript = path.resolve('scripts/compile-tasks.mjs');

  const runCompile = () => {
    execFileSync('node', [compileScript], { stdio: 'inherit' });
  };

  return {
    name: 'task-log-compiler',
    buildStart() {
      runCompile();
    },
    configureServer(server) {
      server.watcher.add(tasksDir);
      const onTaskFileEvent = (filePath: string) => {
        const normalized = filePath.replace(/\\/g, '/');
        if (normalized.includes('/content/tasks/') && normalized.endsWith('.md')) {
          try {
            runCompile();
          } catch (err) {
            console.error('[task-log-compiler] Failed to compile tasks:', err);
          }
        }
      };
      server.watcher.on('add', onTaskFileEvent);
      server.watcher.on('change', onTaskFileEvent);
      server.watcher.on('unlink', onTaskFileEvent);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    taskLogCompilerPlugin(),
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('marked')) {
              return 'vendor-markdown';
            }
            if (id.includes('prismjs')) {
              return undefined;
            }
            if (id.includes('minisearch')) {
              return 'vendor-search';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            return 'vendor-other';
          }
        }
      }
    }
  }
})
