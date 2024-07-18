export interface Task {
  id: string;
  title: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  tasks: Task[];
}