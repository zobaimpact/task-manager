import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

// Define the shape of the Redux store slice
export interface TaskState {
  tasks: Task[];
}

/**
 * Utility function to load tasks from localStorage.
 * Ensures data persistence even after a page refresh.
 */
const loadTasksFromLocalStorage = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return []; // Fallback to an empty array if there's an issue
  }
};

/**
 * Utility function to save tasks to localStorage.
 * Keeps localStorage updated whenever tasks are modified.
 */
const saveTasksToLocalStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

// Initial state with tasks loaded from localStorage
const initialState: TaskState = {
  tasks: loadTasksFromLocalStorage(),
};

// Create Redux slice for task management
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    /**
     * Adds a new task to the store and updates localStorage.
     */
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      saveTasksToLocalStorage(state.tasks);
    },

    /**
     * Edits an existing task by merging updated properties.
     * Uses a `Partial<Task>` to allow for partial updates.
     */
    editTask: (state, action: PayloadAction<{ id: string; updatedTask: Partial<Task> }>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload.updatedTask };
        saveTasksToLocalStorage(state.tasks);
      }
    },

    /**
     * Deletes a task from the store based on its `id` and updates localStorage.
     */
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToLocalStorage(state.tasks);
    },
  },
});

// Export actions for use in components
export const { addTask, editTask, deleteTask } = taskSlice.actions;

// Export reducer to be added to the Redux store
export default taskSlice.reducer;
