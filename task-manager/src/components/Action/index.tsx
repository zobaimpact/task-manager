import React from "react";

interface ActionProps {
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
  handleEditTask: (newText: string) => void;
  handleDeleteTask: () => void;
}

const Action: React.FC<ActionProps> = ({
  priority,
  handleEditTask,
  handleDeleteTask,
}) => {
  return (
    <div className="mt-2 space-x-2">
      <button
        className="btn btn-secondary"
        onClick={() => {
          const newText = prompt("Edit task:");
          if (newText) handleEditTask(newText);
        }}
      >
        Edit
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => {
          window.alert(
            `Are you sure you want to delete this ${priority} Priority Task?`
          );
          handleDeleteTask();
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Action;
