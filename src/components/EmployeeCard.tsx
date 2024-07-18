import React from 'react';
import { useDrop } from 'react-dnd';
import { Employee } from '../types';
import TaskCard from './TaskCard';

interface EmployeeCardProps {
  employee: Employee;
  moveTask: (taskId: string, sourceId: string, targetId: string, newIndex?: number) => void;
  deleteTask: (taskId: string, sourceId: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, moveTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string, sourceId: string }, monitor) => {
      const didDropInside = monitor.didDrop();
      if (didDropInside) {
        return;
      }
      const hoverIndex = employee.tasks.length;
      moveTask(item.id, item.sourceId, employee.id, hoverIndex);
    },
  });

  return (
    <div className="employee-card" ref={drop}>
      <h3>{employee.name}</h3>
      <div className="employee-task-list">
        {employee.tasks.map((task, index) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            index={index} 
            sourceId={employee.id} 
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeCard;