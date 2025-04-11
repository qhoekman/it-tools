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
          v-if="!isRevealed && TIMER_OPTIONS[selectedTimer] > 0"
          class="absolute top-0 left-0 w-full h-full rounded-[2.5rem] overflow-hidden bg-black/50 flex items-center justify-center text-white text-6xl font-bold"
        >
          {{ timer }}
        </div>
      </div>
    </div>
    <div v-else class="mx-auto">
      <div class="flex flex-col gap-2 mb-3 -mt-7">
        <c-buttons-select
          v-model:value="selectedPreset"
          :options="Object.keys(CARD_PRESETS)"
          label="Card Sequence:"
          label-position="left"
        />
        <c-buttons-select
          v-model:value="selectedTimer"
          :options="Object.keys(TIMER_OPTIONS)"
          label="Timer:"
          label-position="left"
        />
        <hr class="opacity-16 w-full" />
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
  'T-Shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
  'Power of 2': [1, 2, 4, 8, 16, 32, 64, '?', '☕'],
  Linear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?', '☕'],
} as const;

const TIMER_OPTIONS = {
  None: 0,
  '1s': 1,
  '2s': 2,
  '3s': 3,
  '5s': 5,
  '10s': 10,
} as const;

interface Props {
  colors?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
});

const selectedPreset = ref<keyof typeof CARD_PRESETS>('Fibonacci');
const selectedTimer = ref<keyof typeof TIMER_OPTIONS>('3s');
const cards = computed(() => CARD_PRESETS[selectedPreset.value]);
const selectedCard = ref<string | number | null>(null);
const isRevealed = ref(false);
const timer = ref(TIMER_OPTIONS[selectedTimer.value]);

let interval: NodeJS.Timeout;

watch([selectedCard, isRevealed], ([newSelectedCard, newIsRevealed]) => {
  clearInterval(interval);

  if (newSelectedCard !== null && !newIsRevealed && TIMER_OPTIONS[selectedTimer.value] > 0) {
    timer.value = TIMER_OPTIONS[selectedTimer.value];
    interval = setInterval(() => {
      timer.value--;
      if (timer.value === 0) {
        clearInterval(interval);
        isRevealed.value = true;
        timer.value = TIMER_OPTIONS[selectedTimer.value];
      }
    }, 1000);
  }
});

watch(selectedTimer, newValue => {
  timer.value = TIMER_OPTIONS[newValue];
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
  timer.value = TIMER_OPTIONS[selectedTimer.value];
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
