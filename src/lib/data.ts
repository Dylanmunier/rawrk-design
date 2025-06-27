import type { Project, User, Task } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatar: 'https://placehold.co/32x32/E6E6FA/4B0082.png?text=AJ' },
  { id: 'user-2', name: 'Bob Williams', avatar: 'https://placehold.co/32x32/E6E6FA/4B0082.png?text=BW' },
  { id: 'user-3', name: 'Charlie Brown', avatar: 'https://placehold.co/32x32/E6E6FA/4B0082.png?text=CB' },
  { id: 'user-4', name: 'Diana Miller', avatar: 'https://placehold.co/32x32/E6E6FA/4B0082.png?text=DM' },
];

const tasks: Task[] = [
  { id: 'task-1', title: 'Design initial mockups', status: 'Done', assignee: users[0], dueDate: new Date('2024-08-15') },
  { id: 'task-2', title: 'Develop landing page', status: 'In Progress', assignee: users[1], dueDate: new Date('2024-08-20') },
  { id: 'task-3', title: 'Set up database schema', status: 'In Progress', assignee: users[2], dueDate: new Date('2024-08-22') },
  { id: 'task-4', title: 'User authentication API', status: 'To Do', assignee: users[2], dueDate: new Date('2024-08-25') },
  { id: 'task-5', title: 'Q&A testing for authentication', status: 'To Do', assignee: users[3], dueDate: new Date('2024-08-28') },
  { id: 'task-6', title: 'Deploy to staging', status: 'To Do', dueDate: new Date('2024-09-01') },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    title: 'QuantumLeap CRM',
    description: 'A next-generation CRM platform using AI to predict customer behavior.',
    longDescription: 'QuantumLeap CRM is an ambitious project to redefine customer relationship management. By leveraging machine learning models, it provides sales teams with predictive analytics, automated lead scoring, and personalized communication strategies. This project involves a full-stack development process, from a scalable backend infrastructure to an intuitive and responsive user interface.',
    tasks: tasks.slice(0, 4),
    team: users.slice(0, 3),
    createdAt: new Date('2024-07-01'),
  },
  {
    id: 'proj-2',
    title: 'StellarGuard Security Suite',
    description: 'Cybersecurity solution for enterprise networks with real-time threat detection.',
    longDescription: 'StellarGuard is a comprehensive security suite designed to protect enterprise networks from modern cyber threats. It features a real-time intrusion detection system, advanced malware analysis, and a centralized dashboard for security administrators. The core technology is built on a distributed architecture to ensure high availability and performance.',
    tasks: tasks.slice(2, 6),
    team: users.slice(1, 4),
    createdAt: new Date('2024-06-15'),
  },
  {
    id: 'proj-3',
    title: 'EcoTrack - Carbon Footprint Calculator',
    description: 'Mobile app to help users track and reduce their carbon footprint.',
    longDescription: 'EcoTrack is a consumer-facing mobile application that empowers individuals to make environmentally friendly choices. Users can log their daily activities, such as travel, diet, and energy consumption, to receive a detailed analysis of their carbon footprint. The app also offers personalized tips, challenges, and community features to encourage sustainable habits.',
    tasks: [tasks[0], tasks[1], tasks[4], tasks[5]],
    team: [users[0], users[3]],
    createdAt: new Date('2024-08-01'),
  },
  {
    id: 'proj-4',
    title: 'Project Nebula',
    description: 'A data visualization tool for astronomical research and discovery.',
    longDescription: 'Project Nebula is a web-based platform for astronomers and astrophysicists to visualize and analyze large datasets from telescopes and sky surveys. It provides interactive 3D renderings of celestial objects, collaborative annotation tools, and integration with existing astronomical databases. The goal is to accelerate research and facilitate new discoveries in the field of astronomy.',
    tasks: tasks.slice(1, 5),
    team: users,
    createdAt: new Date('2024-05-20'),
  }
];
