import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Task } from '../types';

export interface TaskCardProps {
  task: Task;
  index: number;
  sourceId: string;
  moveTask: (taskId: string, sourceId: string, targetId: string, newIndex?: number) => void;
  deleteTask: (taskId: string, sourceId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, sourceId, moveTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, sourceId, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { id: string, sourceId: string, index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveTask(item.id, sourceId, sourceId, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <button className="delete-task" onClick={() => deleteTask(task.id, sourceId)}>×</button>
      </div>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
