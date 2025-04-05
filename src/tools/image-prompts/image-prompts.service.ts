import shrek from '@/assets/prompts/shrek.png';
import ghibli from '@/assets/prompts/ghibli.png';
import pixar from '@/assets/prompts/pixar.png';
import teletubby from '@/assets/prompts/teletubby.png';
import muppet from '@/assets/prompts/muppet.png';

interface ImagePrompt {
  prompt: string;
  model: string;
  image: string;
  title: string;
}

export const imagePrompts: ImagePrompt[] = [
  {
    prompt: 'Recreate this photo using Ghibli anime style from the 90s.',
    model: 'gpt-4o',
    image: ghibli,
    title: 'Ghibli Style',
  },
  {
    prompt: 'Recreate this photo to match 3D animation movies from 2006~2010.',
    model: 'gpt-4o',
    image: pixar,
    title: 'Pixar Style',
  },
  {
    prompt:
      'Recreate this photo as a 3D animation character of 2006. It has green skin. Looks like a friendly monster with extra small trumpets like human ears. The clothing is from the 1400s. It’s mouth is larger then other parts of its face. The monster has no hair and a big belly.',
    model: 'gpt-4o',
    image: shrek,
    title: 'Shrek style',
  },
  {
    prompt:
      'Recreate this photo with a costume in a humanoid shape, covered in purple plush material with a lighter square patch on the stomach. It has large, and rounded ears. A purple, triangular loop sticks out from the top of its head. The character is holding a small red handbag in its left hand. The setting is bright and cheerful, with flowers dotting the grassy hill in the background, suggesting a whimsical or fantasy environment. ',
    model: 'gpt-4o',
    image: teletubby,
    title: 'Teletubby style',
  },
  {
    prompt:
      'Recreate this photo as a puppet-like character. The character has large white eyes with black pupils. It has prominent, round ears and thick. collar. Keep the details of the subject in the photo. ',
    model: 'gpt-4o',
    image: muppet,
    title: 'Muppet style',
  },
];
