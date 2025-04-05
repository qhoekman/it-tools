import { Rotate360 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Spin the wheel',
  path: '/spin-the-wheel',
  description: 'Spin the wheel to get a random item',
  keywords: ['spin', 'the', 'wheel'],
  component: () => import('./spin-the-wheel.vue'),
  icon: Rotate360,
  createdAt: new Date('2025-04-05'),
});
