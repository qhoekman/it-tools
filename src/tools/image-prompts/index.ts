import { CursorText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image prompts',
  path: '/image-prompts',
  description: 'Prompts for image generation',
  keywords: ['image', 'prompts'],
  component: () => import('./image-prompts.vue'),
  icon: CursorText,
  createdAt: new Date('2025-04-05'),
});
