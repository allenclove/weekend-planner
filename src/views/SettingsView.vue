<template>
  <div class="settings-view">
    <div class="container">
      <h1>Settings</h1>

      <div class="settings-section">
        <h2>Data Management</h2>
        <p class="section-description">
          Export your tasks to backup or import tasks from a previous export.
        </p>

        <div class="settings-group">
          <h3>Export Data</h3>
          <div class="button-group">
            <button @click="handleExportJSON" class="btn btn-primary">
              Export as JSON
            </button>
            <button @click="handleExportMarkdown" class="btn btn-secondary">
              Export as Markdown
            </button>
          </div>
          <p class="help-text">
            JSON files can be imported back. Markdown files are for human-readable
            backups.
          </p>
        </div>

        <div class="settings-group">
          <h3>Import Data</h3>
          <div class="import-section">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleImportJSON"
              class="file-input"
            />
            <button @click="triggerFileInput" class="btn btn-outline">
              Choose JSON File
            </button>
            <span v-if="selectedFileName" class="file-name">
              {{ selectedFileName }}
            </span>
          </div>
          <p class="help-text">
            Import tasks from a previously exported JSON file. This will merge
            with existing tasks.
          </p>
        </div>

        <div class="settings-group danger-zone">
          <h3>Danger Zone</h3>
          <button @click="showClearConfirm = true" class="btn btn-danger">
            Clear All Data
          </button>
          <p class="help-text">
            Permanently delete all tasks. This action cannot be undone.
          </p>
        </div>
      </div>

      <div class="settings-section">
        <h2>About</h2>
        <div class="about-info">
          <p><strong>Weekend Todo List</strong></p>
          <p>Version 1.0.0</p>
          <p>A simple and elegant task management application.</p>
        </div>
      </div>
    </div>

    <!-- Clear Data Confirmation Modal -->
    <div v-if="showClearConfirm" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Confirm Clear All Data</h2>
        <p class="modal-message">
          Are you sure you want to delete all tasks? This action cannot be
          undone.
        </p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="handleClearAll" class="btn btn-danger">
            Clear All Data
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  exportToJSON,
  exportToMarkdown,
  importFromJSON,
  downloadFile,
} from '../utils/export';
import { Task } from '../types';

const tasks = ref<Task[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFileName = ref('');
const showClearConfirm = ref(false);

const toast = ref({
  show: false,
  message: '',
  type: 'success',
});

// Load tasks from localStorage
onMounted(() => {
  loadTasks();
});

function loadTasks() {
  try {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      tasks.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    showToast('Error loading tasks', 'error');
  }
}

function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  } catch (error) {
    console.error('Error saving tasks:', error);
    showToast('Error saving tasks', 'error');
  }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = {
    show: true,
    message,
    type,
  };

  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function handleExportJSON() {
  try {
    const jsonContent = exportToJSON(tasks.value);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `weekend-todo-list-${timestamp}.json`;
    downloadFile(jsonContent, filename, 'application/json');
    showToast('Tasks exported successfully as JSON');
  } catch (error) {
    console.error('Error exporting JSON:', error);
    showToast('Error exporting tasks as JSON', 'error');
  }
}

function handleExportMarkdown() {
  try {
    const markdownContent = exportToMarkdown(tasks.value);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `weekend-todo-list-${timestamp}.md`;
    downloadFile(markdownContent, filename, 'text/markdown');
    showToast('Tasks exported successfully as Markdown');
  } catch (error) {
    console.error('Error exporting Markdown:', error);
    showToast('Error exporting tasks as Markdown', 'error');
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleImportJSON(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  selectedFileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const importedTasks = importFromJSON(content);

      // Merge imported tasks with existing ones
      // Avoid duplicates by checking IDs
      const existingIds = new Set(tasks.value.map((t) => t.id));
      let newTasksCount = 0;

      for (const task of importedTasks) {
        if (!existingIds.has(task.id)) {
          tasks.value.push(task);
          existingIds.add(task.id);
          newTasksCount++;
        }
      }

      saveTasks();

      if (newTasksCount > 0) {
        showToast(
          `Successfully imported ${newTasksCount} task${newTasksCount > 1 ? 's' : ''}`
        );
      } else {
        showToast('No new tasks to import (all already exist)');
      }

      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      selectedFileName.value = '';
    } catch (error) {
      console.error('Error importing tasks:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      showToast(`Import failed: ${errorMessage}`, 'error');

      // Reset file input on error
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      selectedFileName.value = '';
    }
  };

  reader.onerror = () => {
    showToast('Error reading file', 'error');
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    selectedFileName.value = '';
  };

  reader.readAsText(file);
}

function handleClearAll() {
  try {
    tasks.value = [];
    saveTasks();
    showClearConfirm.value = false;
    showToast('All tasks cleared successfully');
  } catch (error) {
    console.error('Error clearing tasks:', error);
    showToast('Error clearing tasks', 'error');
  }
}

function closeModal() {
  showClearConfirm.value = false;
}
</script>

<style scoped>
.settings-view {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.settings-group {
  padding: 1.5rem 0;
  border-bottom: 1px solid #ecf0f1;
}

.settings-group:last-child {
  border-bottom: none;
}

.settings-group h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-outline {
  background-color: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-outline:hover {
  background-color: #3498db;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.help-text {
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-top: 0.75rem;
}

.import-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.file-input {
  display: none;
}

.file-name {
  font-size: 0.875rem;
  color: #34495e;
  font-style: italic;
}

.danger-zone {
  background-color: #fef5f5;
  border-radius: 8px;
  padding: 1.5rem;
}

.about-info {
  color: #34495e;
}

.about-info p {
  margin: 0.5rem 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.modal-message {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  z-index: 1001;
}

.toast.success {
  background-color: #27ae60;
}

.toast.error {
  background-color: #e74c3c;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .settings-section {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }

  .toast {
    right: 1rem;
    left: 1rem;
    bottom: 1rem;
  }
}
</style>
