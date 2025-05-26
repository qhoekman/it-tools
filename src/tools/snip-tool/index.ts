import { defineTool } from '../tool';
import { ImagesearchRollerOutlined } from '@vicons/material';

export const tool = defineTool({
  name: 'Snipping tool',
  path: '/snip-tool',
  description: 'A snipping tool to create annotations on images.',
  keywords: ['snipping', 'tool'],
  component: () => import('./snip-tool.vue'),
  icon: ImagesearchRollerOutlined,
  createdAt: new Date('2025-05-26'),
});
