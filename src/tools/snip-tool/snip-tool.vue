<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex space-x-8 pt-0 pb-4 px-4 rounded-lg shadow max-w-3xl w-full">
      <!-- Shape selection -->
      <div class="flex flex-col space-y-2 h-16">
        <span class="text-sm font-medium">Shapes:</span>
        <div class="flex space-x-2">
          <c-tooltip tooltip="Draw a circle">
            <c-button
              :type="isDrawingCircle ? 'primary' : 'default'"
              size="small"
              :disabled="!image"
              @click="toggleShape('circle')"
            >
              <icon-mdi-circle-outline />
            </c-button>
          </c-tooltip>
          <c-tooltip tooltip="Draw a rectangle">
            <c-button
              :type="isDrawingRectangle ? 'primary' : 'default'"
              size="small"
              :disabled="!image"
              @click="toggleShape('rectangle')"
            >
              <icon-mdi-square-outline />
            </c-button>
          </c-tooltip>
          <c-tooltip tooltip="Draw an arrow">
            <c-button
              :type="isDrawingArrow ? 'primary' : 'default'"
              size="small"
              :disabled="!image"
              @click="toggleShape('arrow')"
            >
              <icon-mdi-arrow-right />
            </c-button>
          </c-tooltip>
        </div>
      </div>
      <!-- Line width -->
      <div class="flex flex-col space-y-2 h-16">
        <span class="text-sm font-medium">Width:</span>
        <div class="flex items-center space-x-2 pt-2">
          <input type="range" min="1" max="20" v-model="lineWidth" class="w-32" />
          <span class="text-sm font-medium">{{ lineWidth }}px</span>
        </div>
      </div>
      <!-- Line color -->
      <div class="flex flex-col space-y-2 h-16">
        <span class="text-sm font-medium">Color:</span>
        <input type="color" v-model="lineColor" class="w-12 h-8 p-0 border-none" />
      </div>
      <!-- Actions -->
      <div class="flex flex-col space-y-2 h-16">
        <span class="text-sm font-medium">Actions:</span>
        <div class="flex items-center space-x-2">
          <c-tooltip tooltip="Undo">
            <c-button type="default" size="small" :disabled="drawings.length === 0" @click="handleUndo">
              <icon-mdi-undo />
            </c-button>
          </c-tooltip>
          <c-tooltip tooltip="Redo">
            <c-button type="default" size="small" :disabled="undoStack.length === 0" @click="handleRedo">
              <icon-mdi-redo />
            </c-button>
          </c-tooltip>
          <c-tooltip tooltip="Copy">
            <c-button type="default" size="small" :disabled="!image" @click="handleCopy">
              <icon-mdi-content-copy />
            </c-button>
          </c-tooltip>
          <c-tooltip tooltip="Paste">
            <c-button type="default" size="small" @click="handleManualPaste">
              <icon-mdi-clipboard-edit-outline />
            </c-button>
          </c-tooltip>
          <c-tooltip tooltip="Clear">
            <c-button type="default" size="small" :disabled="!image" @click="clearImageState">
              <icon-mdi-eraser />
            </c-button>
          </c-tooltip>
        </div>
      </div>
    </div>
    <!-- Canvas area -->
    <div
      ref="canvasRef"
      :style="image ? { width: imageSize.width + 'px', height: imageSize.height + 'px' } : {}"
      class="relative border border-border shadow-md rounded-lg overflow-hidden"
      :class="[image ? 'border-solid' : 'border-dashed', isDragging ? 'bg-muted/70' : 'bg-muted/10']"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <template v-if="image">
        <img :src="image" alt="Pasted" :width="imageSize.width" :height="imageSize.height" />
        <svg
          ref="svgRef"
          :width="imageSize.width"
          :height="imageSize.height"
          class="absolute top-0 left-0"
          :viewBox="`0 0 ${imageSize.width} ${imageSize.height}`"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="endDrawing"
          @mouseleave="endDrawing"
        >
          <template v-for="(drawing, index) in drawings" :key="index">
            <template v-if="drawing.type === 'arrow'">
              <line
                :x1="drawing.points[0].x"
                :y1="drawing.points[0].y"
                :x2="drawing.points[1].x"
                :y2="drawing.points[1].y"
                :stroke="drawing.color"
                :stroke-width="drawing.width"
              />
              <line
                v-for="(head, i) in getArrowHeads(drawing.points[0], drawing.points[1], drawing.width)"
                :key="i"
                :x1="drawing.points[1].x"
                :y1="drawing.points[1].y"
                :x2="head.x"
                :y2="head.y"
                :stroke="drawing.color"
                :stroke-width="drawing.width"
              />
            </template>
            <template v-else-if="drawing.type === 'circle'">
              <circle
                :cx="drawing.points[0].x"
                :cy="drawing.points[0].y"
                :r="drawing.radius"
                :stroke="drawing.color"
                :stroke-width="drawing.width"
                fill="none"
              />
            </template>
            <template v-else-if="drawing.type === 'rectangle'">
              <rect
                :x="Math.min(drawing.points[0].x, drawing.points[1].x)"
                :y="Math.min(drawing.points[0].y, drawing.points[1].y)"
                :width="Math.abs(drawing.points[1].x - drawing.points[0].x)"
                :height="Math.abs(drawing.points[1].y - drawing.points[0].y)"
                :stroke="drawing.color"
                :stroke-width="drawing.width"
                fill="none"
              />
            </template>
            <template v-else>
              <polyline
                :points="drawing.points.map(p => `${p.x},${p.y}`).join(' ')"
                fill="none"
                :stroke="drawing.color"
                :stroke-width="drawing.width"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </template>
          </template>
          <polyline
            v-if="currentDrawing.length > 1"
            :points="currentDrawing.map(p => `${p.x},${p.y}`).join(' ')"
            fill="none"
            :stroke="lineColor"
            :stroke-width="lineWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <template v-if="currentArrow.end">
            <line
              :x1="currentArrow.start.x"
              :y1="currentArrow.start.y"
              :x2="currentArrow.end.x"
              :y2="currentArrow.end.y"
              :stroke="lineColor"
              :stroke-width="lineWidth"
            />
            <line
              v-for="(head, i) in getArrowHeads(currentArrow.start, currentArrow.end, lineWidth)"
              :key="i"
              :x1="currentArrow.end.x"
              :y1="currentArrow.end.y"
              :x2="head.x"
              :y2="head.y"
              :stroke="lineColor"
              :stroke-width="lineWidth"
            />
          </template>
          <circle
            v-if="currentCircle"
            :cx="currentCircle.center.x"
            :cy="currentCircle.center.y"
            :r="currentCircle.radius"
            :stroke="lineColor"
            :stroke-width="lineWidth"
            fill="none"
          />
          <rect
            v-if="currentRectangle.end"
            :x="Math.min(currentRectangle.start.x, currentRectangle.end.x)"
            :y="Math.min(currentRectangle.start.y, currentRectangle.end.y)"
            :width="Math.abs(currentRectangle.end.x - currentRectangle.start.x)"
            :height="Math.abs(currentRectangle.end.y - currentRectangle.start.y)"
            :stroke="lineColor"
            :stroke-width="lineWidth"
            fill="none"
          />
        </svg>
      </template>
      <template v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern
              id="pattern_OYpUA9"
              patternUnits="userSpaceOnUse"
              width="9.5"
              height="9.5"
              patternTransform="rotate(120)"
            >
              <line x1="0" y1="0" x2="0" y2="9.5" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern_OYpUA9)" opacity="1" />
        </svg>
      </template>
    </div>
    <div v-if="!image" class="mt-4 text-center">
      <p class="text-muted-foreground/60 mb-2">Paste an image (<kbd>Cmd</kbd> + <kbd>V</kbd>) to start editing</p>
    </div>
    <div v-if="image" class="mt-4 text-center">
      <p class="text-muted-foreground/60 mb-2">Copy the image by pressing (<kbd>Cmd</kbd> + <kbd>C</kbd>)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStyleStore } from '@/stores/style.store';

// Icon imports (replace with your icon lib or use tabler/icons-vue)
import {
  IconCircleOutline,
  IconSquareOutline,
  IconArrowRight,
  IconUndo,
  IconRedo,
  IconContentCopy,
  IconClipboardEditOutline,
  IconEraser,
} from '@tabler/icons-vue';

const image = ref<string | null>(null);
const drawings = ref<any[]>([]);
const currentDrawing = ref<{ x: number; y: number }[]>([]);
const isDrawing = ref(false);
const lineWidth = ref(2);
const lineColor = ref('#ff0000');
const canvasRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const isDrawingArrow = ref(false);
const currentArrow = reactive<{ start: { x: number; y: number }; end: { x: number; y: number } | null }>({
  start: { x: 0, y: 0 },
  end: null,
});
const isDrawingCircle = ref(false);
const currentCircle = ref<{ center: { x: number; y: number }; radius: number } | null>(null);
const isDrawingRectangle = ref(false);
const currentRectangle = reactive<{ start: { x: number; y: number }; end: { x: number; y: number } | null }>({
  start: { x: 0, y: 0 },
  end: null,
});
const isDragging = ref(false);
const undoStack = ref<any[]>([]);
const redoStack = ref<any[]>([]);
const imageSize = ref<{ width: number; height: number }>({ width: 0, height: 0 });
const styleStore = useStyleStore();

function handleUndo() {
  if (drawings.value.length > 0) {
    const newDrawings = [...drawings.value];
    const lastDrawing = newDrawings.pop();
    undoStack.value.push(lastDrawing);
    drawings.value = newDrawings;
    redoStack.value = [];
  }
}
function handleRedo() {
  if (undoStack.value.length > 0) {
    const lastUndone = undoStack.value.pop();
    drawings.value.push(lastUndone);
  }
}

watch(image, val => {
  if (!val) return;
  const img = new window.Image();
  img.onload = () => {
    imageSize.value = { width: img.width, height: img.height };
  };
  img.src = val;
});

function getSvgPoint(e: MouseEvent) {
  const svg = svgRef.value;
  if (!svg) return { x: 0, y: 0 };
  const point = svg.createSVGPoint();
  point.x = e.clientX;
  point.y = e.clientY;
  const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
  return { x: svgPoint.x, y: svgPoint.y };
}

function startDrawing(e: MouseEvent) {
  if (!svgRef.value) return;
  const { x, y } = getSvgPoint(e);
  if (isDrawingArrow.value) {
    currentArrow.start = { x, y };
    currentArrow.end = null;
  } else if (isDrawingCircle.value) {
    currentCircle.value = { center: { x, y }, radius: 0 };
  } else if (isDrawingRectangle.value) {
    currentRectangle.start = { x, y };
    currentRectangle.end = null;
  } else {
    currentDrawing.value = [{ x, y }];
  }
  isDrawing.value = true;
}

function draw(e: MouseEvent) {
  if (!isDrawing.value) return;
  const { x, y } = getSvgPoint(e);
  if (isDrawingArrow.value) {
    currentArrow.end = { x, y };
  } else if (isDrawingCircle.value && currentCircle.value) {
    const dx = x - currentCircle.value.center.x;
    const dy = y - currentCircle.value.center.y;
    currentCircle.value.radius = Math.sqrt(dx * dx + dy * dy);
  } else if (isDrawingRectangle.value) {
    currentRectangle.end = { x, y };
  } else {
    currentDrawing.value.push({ x, y });
  }
}

function endDrawing() {
  isDrawing.value = false;
  if (isDrawingArrow.value && currentArrow.end) {
    drawings.value.push({
      points: [currentArrow.start, currentArrow.end],
      color: lineColor.value,
      width: lineWidth.value,
      type: 'arrow',
    });
    undoStack.value = [];
    redoStack.value = [];
    currentArrow.start = { x: 0, y: 0 };
    currentArrow.end = null;
  } else if (isDrawingCircle.value && currentCircle.value) {
    drawings.value.push({
      points: [currentCircle.value.center],
      radius: currentCircle.value.radius,
      color: lineColor.value,
      width: lineWidth.value,
      type: 'circle',
    });
    undoStack.value = [];
    redoStack.value = [];
    currentCircle.value = null;
  } else if (isDrawingRectangle.value && currentRectangle.end) {
    drawings.value.push({
      points: [currentRectangle.start, currentRectangle.end],
      color: lineColor.value,
      width: lineWidth.value,
      type: 'rectangle',
    });
    undoStack.value = [];
    redoStack.value = [];
    currentRectangle.start = { x: 0, y: 0 };
    currentRectangle.end = null;
  } else if (currentDrawing.value.length > 1) {
    drawings.value.push({
      points: currentDrawing.value,
      color: lineColor.value,
      width: lineWidth.value,
      type: 'line',
    });
    undoStack.value = [];
    redoStack.value = [];
    currentDrawing.value = [];
  }
}

function getArrowHeads(start: { x: number; y: number }, end: { x: number; y: number }, width: number) {
  const headLength = 10 * (width / 2);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  return [
    {
      x: end.x - headLength * Math.cos(angle - Math.PI / 6),
      y: end.y - headLength * Math.sin(angle - Math.PI / 6),
    },
    {
      x: end.x - headLength * Math.cos(angle + Math.PI / 6),
      y: end.y - headLength * Math.sin(angle + Math.PI / 6),
    },
  ];
}

function handlePaste(e: ClipboardEvent) {
  drawings.value = [];
  currentDrawing.value = [];
  const items = e.clipboardData?.items;
  let pastedCount = 0;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = event => {
          image.value = event.target?.result as string;
        };
        reader.readAsDataURL(blob as Blob);
        pastedCount++;
      }
    }
  }
}

async function handleManualPaste() {
  try {
    drawings.value = [];
    currentDrawing.value = [];
    // @ts-ignore
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      if (item.types.includes('image/png')) {
        const blob = await item.getType('image/png');
        const reader = new FileReader();
        reader.onload = event => {
          image.value = event.target?.result as string;
        };
        reader.readAsDataURL(blob);
      }
    }
  } catch (err) {
    // Optionally show error
  }
}

function handleCopy() {
  if (canvasRef.value && svgRef.value && image.value) {
    const canvasWidth = canvasRef.value.clientWidth;
    const canvasHeight = canvasRef.value.clientHeight;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx?.drawImage(img, 0, 0, imageSize.value.width, imageSize.value.height);
      const svg = svgRef.value;
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const svgImg = new window.Image();
      svgImg.onload = () => {
        ctx?.drawImage(svgImg, 0, 0, canvasWidth, canvasHeight);
        canvas.toBlob(blob => {
          if (blob) {
            const item = new window.ClipboardItem({ 'image/png': blob });
            // @ts-ignore
            navigator.clipboard.write([item]);
          }
        }, 'image/png');
      };
      svgImg.src = svgUrl;
    };
    img.src = image.value;
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false;
  drawings.value = [];
  currentDrawing.value = [];
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = event => {
        image.value = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
function handleDragOver() {
  isDragging.value = true;
}
function handleDragLeave() {
  isDragging.value = false;
}

onMounted(() => {
  styleStore.isMenuCollapsed = true;
  document.addEventListener('paste', handlePaste);
});
onBeforeUnmount(() => {
  document.removeEventListener('paste', handlePaste);
});

function clearImageState() {
  image.value = null;
  drawings.value = [];
  currentDrawing.value = [];
  currentArrow.start = { x: 0, y: 0 };
  currentArrow.end = null;
  currentCircle.value = null;
  currentRectangle.start = { x: 0, y: 0 };
  currentRectangle.end = null;
}

function toggleShape(shape: 'circle' | 'rectangle' | 'arrow') {
  isDrawingCircle.value = shape === 'circle' ? !isDrawingCircle.value : false;
  isDrawingRectangle.value = shape === 'rectangle' ? !isDrawingRectangle.value : false;
  isDrawingArrow.value = shape === 'arrow' ? !isDrawingArrow.value : false;
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.min-h-screen {
  min-height: 100vh;
}
.bg-background {
  background: #f8f9fa;
}
.bg-primary-foreground\/90 {
  background: rgba(255, 255, 255, 0.9);
}
.text-primary {
  color: #333;
}
.p-4 {
  padding: 1rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.max-w-3xl {
  max-width: 48rem;
}
.w-full {
  width: 100%;
}
.mb-4 {
  margin-bottom: 1rem;
}
.space-x-8 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 2rem;
}
.h-16 {
  height: 4rem;
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}
.border {
  border-width: 1px;
}
.border-border {
  border-color: #e5e7eb;
}
.shadow-md {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.overflow-hidden {
  overflow: hidden;
}
.border-solid {
  border-style: solid;
}
.border-dashed {
  border-style: dashed;
}
.bg-muted\/70 {
  background: rgba(240, 240, 240, 0.7);
}
.bg-muted\/10 {
  background: rgba(240, 240, 240, 0.1);
}
.mt-4 {
  margin-top: 1rem;
}
.text-center {
  text-align: center;
}
.text-muted-foreground\/60 {
  color: #888;
  opacity: 0.6;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.w-32 {
  width: 8rem;
}
.w-12 {
  width: 3rem;
}
.h-8 {
  height: 2rem;
}
.p-0 {
  padding: 0;
}
.border-none {
  border: none;
}
</style>
