import shrek from '@/assets/prompts/shrek.png';
import ghibli from '@/assets/prompts/ghibli.png';
import pixar from '@/assets/prompts/pixar.png';
import teletubby from '@/assets/prompts/teletubby.png';
import sesamestreet from '@/assets/prompts/sesamestreet.png';
import goomba from '@/assets/prompts/goomba.png';
import shinchan from '@/assets/prompts/shinchan.png';
import pixar2 from '@/assets/prompts/pixar2.png';
import hannabarbara from '@/assets/prompts/hannabarbara.png';
import cuphead from '@/assets/prompts/cuphead.png';
import pingpong from '@/assets/prompts/pingpong.png';
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
    title: 'Pixar Style 1',
  },
  {
    prompt:
      'Recreate this person as stylized cartoon character rendered as a 3D video game art style typical of early 2000s console games. The character has a large, rounded head with simple, geometric features including a triangular nose, wide oval white eyes with black pupils and flat ears. Keep the face details of the photo for the character.',
    model: 'gpt-4o',
    image: pixar2,
    title: 'Pixar Style 2',
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
      'Recreate this photo as a puppet-like character. The character has large white eyes and red round nose. It has prominent, round ears and thick. collar. Keep the details of the subject in the photo. ',
    model: 'gpt-4o',
    image: sesamestreet,
    title: 'Sesame Street style',
  },
  {
    prompt:
      'Recreate this photo with the subject as a small, 3d animated (from 2005) creature with only a head that makes up most of its body. It has no body, but only two large blacks stumps as legs. It has two large, white eyes with black pupils.',
    model: 'gpt-4o',
    image: goomba,
    title: 'Goomba style',
  },
  {
    prompt:
      'Recreate this photo with the subject as cartoon illustrated in a bold, flat 2D animation style typical of late 90s to early 2000s Japanese anime for children by Yoshihito Usui. The character has a large, rounded head with exaggerated features: thick black eyebrows, massive oval-shaped black eyes with tiny white pupils. Keep the face details of the original photo in the new cartoon character.',
    model: 'gpt-4o',
    image: shinchan,
    title: 'Shin-chan style',
  },
  {
    prompt:
      'Recreate this photo with the subject as a cartoon character with the Hanna Barbera art style. Keep the face details of the original photo but more expressive.',
    model: 'gpt-4o',
    image: hannabarbara,
    title: 'Hanna Barbera style',
  },
  {
    prompt:
      'Recreate this photo with the subject in the Cuphead game art style which is similar to the Mickey Mouse rubber horse animation from the 1920s to 1930s. Use a black and white filter. Keep the face details of the original photo.',
    model: 'gpt-4o',
    image: cuphead,
    title: 'Cuphead style',
  },
  {
    prompt:
      'Recreate this photo with large ping-pong ball white eyes with black pupils that are popping out for the subject. The expression of the character is shocked',
    model: 'gpt-4o',
    image: pingpong,
    title: 'Ping-pong ball eyes',
  },
];
