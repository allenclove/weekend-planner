import { Task } from '../types';

export interface ExportData {
  version: string;
  exportDate: string;
  tasks: Task[];
}

/**
 * Exports all tasks to a JSON string
 * @param tasks Array of tasks to export
 * @returns JSON string containing all tasks
 */
export function exportToJSON(tasks: Task[]): string {
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    tasks,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Exports all tasks to a human-readable markdown format
 * @param tasks Array of tasks to export
 * @returns Markdown string containing all tasks
 */
export function exportToMarkdown(tasks: Task[]): string {
  const lines: string[] = [];

  lines.push('# Weekend Todo List - Task Export');
  lines.push('');
  lines.push(`**Export Date:** ${new Date().toLocaleString()}`);
  lines.push(`**Total Tasks:** ${tasks.length}`);
  lines.push('');

  // Group tasks by completion status
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);

  // Pending Tasks
  if (pendingTasks.length > 0) {
    lines.push('## Pending Tasks');
    lines.push('');

    pendingTasks.forEach((task, index) => {
      lines.push(`${index + 1}. **${task.title}**`);
      if (task.description) {
        lines.push(`   - *Description:* ${task.description}`);
      }
      if (task.dueDate) {
        lines.push(`   - *Due Date:* ${new Date(task.dueDate).toLocaleDateString()}`);
      }
      if (task.category) {
        lines.push(`   - *Category:* ${task.category}`);
      }
      if (task.priority) {
        lines.push(`   - *Priority:* ${task.priority}`);
      }
      lines.push('');
    });
  }

  // Completed Tasks
  if (completedTasks.length > 0) {
    lines.push('## Completed Tasks');
    lines.push('');

    completedTasks.forEach((task, index) => {
      lines.push(`${index + 1}. ~~**${task.title}**~~`);
      if (task.description) {
        lines.push(`   - *Description:* ${task.description}`);
      }
      if (task.dueDate) {
        lines.push(`   - *Due Date:* ${new Date(task.dueDate).toLocaleDateString()}`);
      }
      if (task.category) {
        lines.push(`   - *Category:* ${task.category}`);
      }
      if (task.priority) {
        lines.push(`   - *Priority:* ${task.priority}`);
      }
      if (task.completedAt) {
        lines.push(`   - *Completed At:* ${new Date(task.completedAt).toLocaleString()}`);
      }
      lines.push('');
    });
  }

  if (tasks.length === 0) {
    lines.push('*No tasks found.*');
  }

  return lines.join('\n');
}

/**
 * Validates the imported data structure
 * @param data Unknown data to validate
 * @returns True if data is valid, false otherwise
 */
function validateImportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const importData = data as Record<string, unknown>;

  // Check if it has tasks array
  if (!Array.isArray(importData.tasks)) {
    return false;
  }

  // Validate each task
  for (const task of importData.tasks) {
    if (typeof task !== 'object' || task === null) {
      return false;
    }

    const taskObj = task as Record<string, unknown>;

    // Required fields
    if (typeof taskObj.id !== 'string' || typeof taskObj.title !== 'string') {
      return false;
    }

    // Optional fields validation
    if (
      taskObj.description !== undefined &&
      typeof taskObj.description !== 'string'
    ) {
      return false;
    }

    if (
      taskObj.completed !== undefined &&
      typeof taskObj.completed !== 'boolean'
    ) {
      return false;
    }

    if (
      taskObj.dueDate !== undefined &&
      taskObj.dueDate !== null &&
      typeof taskObj.dueDate !== 'string'
    ) {
      return false;
    }

    if (
      taskObj.category !== undefined &&
      typeof taskObj.category !== 'string'
    ) {
      return false;
    }

    if (
      taskObj.priority !== undefined &&
      !['low', 'medium', 'high'].includes(taskObj.priority as string)
    ) {
      return false;
    }

    if (
      taskObj.completedAt !== undefined &&
      taskObj.completedAt !== null &&
      typeof taskObj.completedAt !== 'string'
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Imports tasks from a JSON string
 * @param jsonString JSON string to import
 * @returns Array of imported tasks
 * @throws Error if JSON is invalid or data structure is incorrect
 */
export function importFromJSON(jsonString: string): Task[] {
  try {
    const data = JSON.parse(jsonString);

    if (!validateImportData(data)) {
      throw new Error('Invalid data structure. Please check the file format.');
    }

    return data.tasks;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format. Please check the file content.');
    }
    throw error;
  }
}

/**
 * Triggers a file download in the browser
 * @param content Content to download
 * @param filename Name of the file
 * @param mimeType MIME type of the file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
