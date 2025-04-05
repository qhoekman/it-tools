<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import type { ImagePrompt } from './image-prompts.service';
import { imagePrompts as defaultImagePrompts } from './image-prompts.service';

interface Props {
  imagePrompts: ImagePrompt[]
}

const props = withDefaults(defineProps<Props>(), {
  imagePrompts: () => defaultImagePrompts,
});

const { imagePrompts } = toRefs(props);
const theme = useThemeVars();
</script>

<template>
  <c-card class="flex flex-col gap-4">
    <div v-for="prompt in imagePrompts" :key="prompt.title" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <span>{{ prompt.title }}</span>
        <div
          class="rounded-full px-8px py-3px text-xs text-white dark:text-neutral-800"
          :style="{
            'background-color': theme.primaryColor,
          }"
        >
          {{ prompt.model }}
        </div>
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        <div class="relative h-24 w-full overflow-hidden md:size-24">
          <img
            :src="prompt.image"
            :alt="prompt.prompt"
            class="absolute bottom-4 left-0 right-0 top-4 z-10 h-16 w-full rounded-md object-contain md:inset-0 md:size-24 md:object-cover"
          />
          <img
            :src="prompt.image"
            :alt="prompt.prompt"
            class="absolute bottom-0 left-0 right-0 top-0 z-0 h-24 w-full rounded-md object-cover opacity-50 blur-md md:hidden"
          />
        </div>
        <c-code class="w-full flex-1" :code="prompt.prompt" />
      </div>
    </div>
  </c-card>
</template>
