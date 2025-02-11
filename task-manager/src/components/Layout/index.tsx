import React from "react";
import Action from "../Action/index";

// Define Task interface (should match TaskDashboard.tsx)
interface Task {
  title: string;
  id: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

// Define props interface for Layout component
interface LayoutProps {
  level: Task["priority"];
  tasks: Task[];
  handleEditTask: (id: string, updatedTask: Partial<Task>) => void;
  handleDeleteTask: (id: string) => void; // Update this line
}

const Layout: React.FC<LayoutProps> = ({
  level,
  tasks,
  handleEditTask,
  handleDeleteTask,
}) => {
  return (
    <div className="bg-white-100 p-4 rounded shadow-lg">
      <h2 className="text-lg font-primary font-semibold mb-2">
        {level} Priority
      </h2>

      {tasks.map((task) => (
        <div key={task.title} className="bg-white p-2 rounded mb-2">
          <h3 className="text-base font-bold ">{task.title}</h3>
          <p className="text-sm text-gray-700 description mb-2">
            {task.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
          <p className="text-xs text-red-600 mt-2">Status: {task.status}</p>

          {task && (
            <Action
              priority={level}
              status={task.status}
              handleEditTask={(updatedTask) =>
                handleEditTask(task.id, updatedTask)
              }
              handleDeleteTask={() => handleDeleteTask(task.id)} // Pass task.id
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Layout;
