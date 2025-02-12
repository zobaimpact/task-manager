import React, { useCallback } from "react";

// Define Task interface (same as TaskDashboard.tsx)
interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

// Define props interface for Action component
interface ActionProps {
  selectedTask: Task;
  priority?: string;
  status?: string;
  handleEditTask: (updatedTask: Task) => void;
  handleDeleteTask: () => void;
}

const Action: React.FC<ActionProps> = React.memo(({ handleDeleteTask, handleEditTask, selectedTask }) => {
  
  // Memoized callback to handle task edits
  const onEditTask = useCallback(() => handleEditTask(selectedTask), [handleEditTask, selectedTask]);

  // Memoized callback to handle task deletion
  const onDeleteTask = useCallback(() => handleDeleteTask(), [handleDeleteTask]);

  return (
    <div className="mt-2 space-x-2">
      <button className="btn btn-secondary cursor-pointer" onClick={onEditTask}>
        Edit
      </button>

      <button className="btn btn-secondary bg-red-400 rounded-2xl shadow-lg cursor-pointer" onClick={onDeleteTask}>
        Delete
      </button>
    </div>
  );
});

export default Action;
