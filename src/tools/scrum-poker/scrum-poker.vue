<template>
  <div>
    <div v-if="selectedCard !== null" class="flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-64 h-96 text-sm overflow-hidden rounded-xl cursor-pointer" @click="handleBackClick">
          <uno-card :value="selectedCard" :color="getCardColor(cards.indexOf(selectedCard))" :flipped="isRevealed">
            <uno-card-chameleon :value="selectedCard" :color="getCardColor(cards.indexOf(selectedCard))" />
          </uno-card>
        </div>
        <div
          v-if="!isRevealed"
          class="absolute top-0 left-0 w-full h-full rounded-[2.5rem] overflow-hidden bg-black/50 flex items-center justify-center text-white text-6xl font-bold"
        >
          {{ timer }}
        </div>
      </div>
    </div>
    <div v-else class="container mx-auto p-4">
      <div class="mb-6">
        <c-buttons-select
          v-model:value="selectedPreset"
          :options="Object.keys(CARD_PRESETS)"
          label="Card Sequence:"
          label-position="left"
        />
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        <div v-for="(value, index) in cards" :key="value" class="relative">
          <div class="w-full aspect-[2/3] text-lg shadow-sm hover:shadow-lg cursor-pointer overflow-hidden rounded-xl">
            <uno-card :value="value" :color="getCardColor(index)" :flipped="true" @click="handleCardClick(value)">
              <uno-card-chameleon :value="value" :color="getCardColor(index)" />
            </uno-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import UnoCard from './cards/uno-card.vue';
import UnoCardChameleon from './cards/uno-card-chameleon.vue';
import CButtonsSelect from '@/ui/c-buttons-select/c-buttons-select.vue';

const CARD_PRESETS = {
  Fibonacci: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'],
  'T-Shirt Sizes': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
  'Powers of 2': [1, 2, 4, 8, 16, 32, 64, '?', '☕'],
  Linear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?', '☕'],
} as const;

interface Props {
  timeToReveal?: number;
  colors?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
  timeToReveal: 3,
});

const selectedPreset = ref<keyof typeof CARD_PRESETS>('Fibonacci');
const cards = computed(() => CARD_PRESETS[selectedPreset.value]);
const selectedCard = ref<string | number | null>(null);
const isRevealed = ref(false);
const timer = ref(props.timeToReveal);

let interval: NodeJS.Timeout;

watch([selectedCard, isRevealed], ([newSelectedCard, newIsRevealed]) => {
  clearInterval(interval);

  if (newSelectedCard !== null && !newIsRevealed) {
    interval = setInterval(() => {
      timer.value--;
      if (timer.value === 0) {
        clearInterval(interval);
        isRevealed.value = true;
        timer.value = props.timeToReveal;
      }
    }, 1000);
  }
});

const getCardColor = (index: number) => {
  return props.colors[index % props.colors.length];
};

const handleCardClick = (value: string | number) => {
  selectedCard.value = value;
  isRevealed.value = false;
};

const handleBackClick = () => {
  selectedCard.value = null;
  isRevealed.value = false;
  timer.value = props.timeToReveal;
};
</script>

<style lang="less" scoped>
.container {
  @apply mx-auto px-4;
}

.bg-black\/50 {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
