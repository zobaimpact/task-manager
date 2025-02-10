import React from "react";
import Action from "../Action/index";

// Define Task interface (should match TaskDashboard.tsx)
interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "To-Do" | "In-Progress" | "Done";
}

// Define props interface for Layout component
interface LayoutProps {
  level: Task["priority"];
  tasks: Task[];
  selectedTask: Task | null;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  level,
  tasks,
  selectedTask,
  handleEditTask,
  handleDeleteTask,
}) => {
  return (
    <div className="bg-red-100 p-4 rounded border border-red-400 ">
      <h2 className="text-lg font-primary font-semibold mb-2">
        {level} Priority
      </h2>

      {tasks.map((task) => (
        <div key={task.title} className="bg-white p-2 rounded mb-2">
          <h3 className="text-base font-bold">{task.title}</h3>
          <p className="text-sm text-gray-700">{task.description}</p>
          <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
          <p className="text-xs text-blue-600">Status: {task.status}</p>

          {task && (
            <Action
              priority={level}
              status={task.status}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              selectedTask={selectedTask}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Layout;
