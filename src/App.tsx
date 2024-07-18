import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import { Task, Employee } from './types';
import TaskForm from './components/TaskForm';
import TaskQueue from './components/TaskQueue';
import EmployeeCard from './components/EmployeeCard';
import { TaskCardProps } from './components/TaskCard';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const storedEmployees = localStorage.getItem('employees');
    return storedEmployees ? JSON.parse(storedEmployees) : [
      { id: 'employee-1', name: 'Employee 1', tasks: [] },
      { id: 'employee-2', name: 'Employee 2', tasks: [] },
      { id: 'employee-3', name: 'Employee 3', tasks: [] },
      { id: 'employee-4', name: 'Employee 4', tasks: [] },
    ];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const moveTask: TaskCardProps['moveTask'] = (taskId, sourceId, targetId, newIndex) => {
    if (sourceId === targetId) {
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => {
          if (emp.id === sourceId) {
            const tasks = [...emp.tasks];
            const [movedTask] = tasks.splice(tasks.findIndex(t => t.id === taskId), 1);
            tasks.splice(newIndex!, 0, movedTask);
            return { ...emp, tasks };
          }
          return emp;
        })
      );
      return;
    }

    if (sourceId === 'taskQueue') {
      const taskToMove = tasks.find(t => t.id === taskId);
      if (!taskToMove) return;

      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === targetId 
            ? { ...emp, tasks: [...emp.tasks, taskToMove] } 
            : emp
        )
      );
    } else if (targetId === 'taskQueue') {
      setEmployees(prevEmployees => {
        const updatedEmployees = prevEmployees.map(emp => 
          emp.id === sourceId 
            ? { ...emp, tasks: emp.tasks.filter(t => t.id !== taskId) } 
            : emp
        );
        const taskToMove = prevEmployees.find(e => e.id === sourceId)?.tasks.find(t => t.id === taskId);
        if (taskToMove) setTasks(prevTasks => [...prevTasks, taskToMove]);
        return updatedEmployees;
      });
    } else {
      setEmployees(prevEmployees => {
        const sourceEmployee = prevEmployees.find(e => e.id === sourceId);
        const taskToMove = sourceEmployee?.tasks.find(t => t.id === taskId);
        if (!taskToMove) return prevEmployees;

        return prevEmployees.map(emp => {
          if (emp.id === sourceId) {
            return { ...emp, tasks: emp.tasks.filter(t => t.id !== taskId) };
          }
          if (emp.id === targetId) {
            return { ...emp, tasks: [...emp.tasks, taskToMove] };
          }
          return emp;
        });
      });
    }
  };
  const deleteTask: TaskCardProps['deleteTask'] = (taskId, sourceId) => {
    if (sourceId === 'taskQueue') {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } else {
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === sourceId
            ? { ...emp, tasks: emp.tasks.filter(task => task.id !== taskId) }
            : emp
        )
      );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <h1>Task Management App</h1>
        <TaskForm addTask={addTask} />
        <div className="content">
          <TaskQueue tasks={tasks} moveTask={moveTask} deleteTask={deleteTask} />
          <div className="employee-list">
            {employees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} moveTask={moveTask} deleteTask={deleteTask} />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;