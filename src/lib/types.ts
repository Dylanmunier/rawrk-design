export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: User;
  dueDate: Date;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tasks: Task[];
  team: User[];
  createdAt: Date;
};
