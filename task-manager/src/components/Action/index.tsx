import React from "react";

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
  selectedTask?: Task;
  handleEditTask: (updatedTask: Task) => void;
  handleDeleteTask: () => void;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

const Action: React.FC<ActionProps> = ({
  handleDeleteTask,
  handleEditTask,
  selectedTask
}) => {

  return (
    <div className="mt-2 space-x-2">
      <button className="btn btn-secondary" onClick={() => handleEditTask(selectedTask)}>
        Edit
      </button>

      <button
        className="btn btn-secondary p-4 bg-red-400 rounded-2xl shadow-lg"
        onClick={() => handleDeleteTask()}
      >
        Delete
      </button>
    </div>
  );
};

export default Action;
