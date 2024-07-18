import React from 'react';
import { useDrop } from 'react-dnd';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface TaskQueueProps {
  tasks: Task[];
  moveTask: (taskId: string, sourceId: string, targetId: string, newIndex?: number) => void;
  deleteTask: (taskId: string, sourceId: string) => void;
}

const TaskQueue: React.FC<TaskQueueProps> = ({ tasks, moveTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string, sourceId: string }) => moveTask(item.id, item.sourceId, 'taskQueue'),
  });

  return (
    <div className="task-queue" ref={drop}>
      <h2>Task Queue</h2>
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            sourceId="taskQueue"
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskQueue;