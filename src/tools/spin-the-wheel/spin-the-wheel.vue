<script setup>
import { computed, onMounted, ref } from 'vue';

// State
const itemsText = ref('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
const items = ref([]);
const isSpinning = ref(false);
const rotation = ref(0);
const selectedItem = ref('');
const wheelRef = ref(null);
const radius = ref(0);

// Colors for wheel segments
const colors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#8AC24A',
  '#00BCD4',
  '#E91E63',
  '#3F51B5',
];

// Parse items from text area
function parseItems() {
  items.value = itemsText.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

// Calculate segment angle
const segmentAngle = computed(() => {
  return items.value.length > 0 ? 360 / items.value.length : 0;
});

// Generate wheel segments
const wheelSegments = computed(() => {
  return items.value.map((item, index) => {
    const startAngle = index * segmentAngle.value;
    return {
      startAngle,
      endAngle: startAngle + segmentAngle.value,
      color: colors[index % colors.length],
    };
  });
});

// Spin the wheel
function spinWheel() {
  if (isSpinning.value || items.value.length < 2) {
    return;
  }

  isSpinning.value = true;
  selectedItem.value = '';

  // Calculate a random spin (between 3 and 5 full rotations plus a random segment)
  const minSpins = 3;
  const maxSpins = 5;
  const spins = minSpins + Math.random() * (maxSpins - minSpins);
  const randomAngle = Math.floor(Math.random() * 360);
  const targetRotation = rotation.value + spins * 360 + randomAngle;

  // Animate the spin
  rotation.value = targetRotation;

  // Calculate the selected item after spinning
  setTimeout(() => {
    isSpinning.value = false;

    // Calculate which segment is at the top (pointer) position
    const normalizedRotation = targetRotation % 360;
    const selectedIndex = items.value.length - 1 - Math.floor(normalizedRotation / segmentAngle.value);
    const adjustedIndex = selectedIndex % items.value.length;

    selectedItem.value = items.value[adjustedIndex];
  }, 3000); // Match this with the CSS transition duration
}

// Initialize
onMounted(() => {
  parseItems();
  if (wheelRef.value) {
    const rect = wheelRef.value.getBoundingClientRect();
    radius.value = rect.width / 2;
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="w-full flex flex-col gap-6 md:flex-row">
      <!-- Input Section -->
      <div class="w-full p-4 md:w-1/2">
        <c-input-text
          v-model:value="itemsText"
          multiline
          raw-text
          rows="22"
          placeholder="Enter items (one per line)"
          @update:value="parseItems"
        />
      </div>

      <!-- Wheel Section -->
      <div class="w-full flex flex-col items-center justify-center md:w-2/3">
        <div class="relative aspect-square max-w-md w-full">
          <!-- Wheel -->
          <div
            ref="wheelRef"
            class="wheel absolute inset-0 overflow-hidden border-4 border-gray-800 rounded-full shadow-lg"
            :style="{ transform: `rotate(${rotation}deg)` }"
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <!-- Wheel segments -->
              <g v-for="(segment, index) in wheelSegments" :key="index">
                <path
                  :d="`M 50 50 L ${50 + 50 * Math.cos((segment.startAngle * Math.PI) / 180)} ${
                    50 - 50 * Math.sin((segment.startAngle * Math.PI) / 180)
                  } A 50 50 0 0 0 ${50 + 50 * Math.cos((segment.endAngle * Math.PI) / 180)} ${
                    50 - 50 * Math.sin((segment.endAngle * Math.PI) / 180)
                  } Z`"
                  :fill="segment.color"
                  stroke="#333"
                  stroke-width="0.5"
                />

                <!-- Item labels -->
                <text
                  :x="50 + 35 * Math.cos(((segment.startAngle + segmentAngle / 2) * Math.PI) / 180)"
                  :y="50 - 35 * Math.sin(((segment.startAngle + segmentAngle / 2) * Math.PI) / 180)"
                  text-anchor="middle"
                  :transform="`rotate(${90 - (segment.startAngle + segmentAngle / 2)}, ${
                    50 + 35 * Math.cos(((segment.startAngle + segmentAngle / 2) * Math.PI) / 180)
                  }, ${50 - 35 * Math.sin(((segment.startAngle + segmentAngle / 2) * Math.PI) / 180)})`"
                  fill="white"
                  font-weight="bold"
                  font-size="1.33"
                  :title="items[index]"
                  class="wheel-text"
                >
                  {{ items[index] }}
                </text>
              </g>

              <!-- Center hub -->
              <circle cx="50" cy="50" r="8" fill="#1f2937" stroke="white" stroke-width="1" />
            </svg>
          </div>

          <!-- Pointer -->
          <div class="absolute left-1/2 top-0 z-30 transform -translate-x-1/2 -translate-y-1/2">
            <div class="h-12 w-8 flex justify-center">
              <div class="h-8 w-4 rounded-t-full bg-red-600" />
              <div
                class="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-600 -mt-1"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <c-button :disabled="isSpinning || items.length < 2" class="mt-4 w-full" @click="spinWheel">
            {{ isSpinning ? 'Spinning...' : 'Spin the Wheel' }}
          </c-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel {
  transition: transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  transform-origin: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background: #f0f0f0;
}

.wheel-text {
  font-family: Arial, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
