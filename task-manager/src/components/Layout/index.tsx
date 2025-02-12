import React, { useCallback } from "react";
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
  handleDeleteTask: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = React.memo(({ level, tasks, handleEditTask, handleDeleteTask }) => {
  
  // Memoized delete function to prevent unnecessary re-renders
  const onDeleteTask = useCallback((id: string) => handleDeleteTask(id), [handleDeleteTask]);

  return (
    <div className="bg-white-100 shadow-lg bg-red-100 p-4 rounded border border-red-400">
      <h2 className="text-lg font-primary font-semibold mb-2">
        {level} Priority
      </h2>

      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-2 rounded mb-2">
          <h3 className="text-base font-bold">{task.title}</h3>
          <p className="text-sm text-gray-700 description mb-2">
            {task.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
          <p className="text-xs text-red-600 mt-2">Status: {task.status}</p>

          {/* Pass handlers with memoized function */}
          <Action
            priority={level}
            status={task.status}
            selectedTask={task}
            handleEditTask={() => handleEditTask(task.id, task)}
            handleDeleteTask={() => onDeleteTask(task.id)}
          />
        </div>
      ))}
    </div>
  );
});

export default Layout;
