import React, { useState } from "react";
import { Calendar, CheckCircle, Flag, Star, Award, Plus } from "lucide-react";
import { Datepicker } from "flowbite-react";

// Task and Goal interfaces
interface Task {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
}

interface Goal {
  id: number;
  title: string;
  achieved: boolean;
}

const Tasks: React.FC = () => {
  const selectedDate = useState<Date>(new Date())[0];
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete React module",
      deadline: "2024-11-15",
      completed: false,
    },
    {
      id: 2,
      title: "Submit project report",
      deadline: "2024-11-18",
      completed: false,
    },
    {
      id: 3,
      title: "Update portfolio",
      deadline: "2024-11-20",
      completed: true,
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: "Finish 5 tasks", achieved: false },
    { id: 2, title: "Work on a project daily", achieved: false },
  ]);

  // Task completion progress
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length
    ? Math.floor((completedTasks / tasks.length) * 100)
    : 0;

  // Handlers
  const handleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: tasks.length + 1,
        title: newTaskTitle.trim(),
        deadline: selectedDate.toISOString().split("T")[0],
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
    }
  };

  const handleGoalToggle = (id: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, achieved: !goal.achieved } : goal
      )
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Calendar Section */}
        <section className="p-4 rounded-lg border">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Calendar size={20} className="mr-2" /> Set Deadlines on Calendar
          </h2>
          <Datepicker value={selectedDate} inline />
        </section>

        {/* Task Management */}
        <section className="bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CheckCircle size={20} className="mr-2" /> Manage Your Tasks
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New task title"
              className="w-full p-2 border rounded-lg text-gray-700"
            />
            <button
              onClick={addTask}
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskCompletion(task.id)}
                  className="w-4 h-4"
                />
                <span
                  className={`flex-1 ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title} -{" "}
                  <span className="text-sm text-gray-500">
                    Deadline: {task.deadline}
                  </span>
                </span>
                <span
                  className={`text-xs p-1 rounded-full ${
                    task.completed
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Progress: {completedTasks} of {tasks.length} tasks completed
            </p>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="bg-blue-600"
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="p-4 rounded-lg border">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Flag size={20} className="mr-2" /> Set Your Goals
          </h2>
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={goal.achieved}
                  onChange={() => handleGoalToggle(goal.id)}
                  className="w-4 h-4"
                />
                <span
                  className={`flex-1 ${
                    goal.achieved ? "line-through text-gray-400" : ""
                  }`}
                >
                  {goal.title}
                </span>
                <span
                  className={`text-xs p-1 rounded-full ${
                    goal.achieved
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {goal.achieved ? "Achieved" : "In Progress"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Achievements Section */}
        <section className="p-4 rounded-lg border">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Star size={20} className="mr-2" /> Your Achievements
          </h2>
          <div className="flex space-x-6">
            {completedTasks >= 5 && (
              <div className="flex items-center space-x-2 bg-green-200 text-green-800 p-3 rounded-lg">
                <Award size={24} />
                <span className="font-semibold">Completed 5 Tasks</span>
              </div>
            )}
            {goals.filter((goal) => goal.achieved).length >= 2 && (
              <div className="flex items-center space-x-2 bg-blue-200 text-blue-800 p-3 rounded-lg">
                <Award size={24} />
                <span className="font-semibold">Achieved 2 Goals</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tasks;
