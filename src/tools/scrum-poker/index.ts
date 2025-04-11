import { PlayCard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Scrum poker',
  path: '/scrum-poker',
  description: 'Scrum poker is a tool that allows you to play poker with your team.',
  keywords: ['scrum', 'poker'],
  component: () => import('./scrum-poker.vue'),
  icon: PlayCard,
  createdAt: new Date('2025-04-11'),
});
