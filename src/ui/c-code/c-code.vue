<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    code: string;
    showCopy?: boolean;
  }>(),
  {
    showCopy: true,
  },
);

const { code, showCopy } = toRefs(props);
</script>

<template>
  <div class="relative">
    <pre class="overflow-x-auto rounded bg-gray-100 p-4 dark:bg-gray-800">
      <code>{{ code }}</code>
    </pre>
    <div v-if="showCopy" class="absolute right-2 top-2">
      <c-text-copyable :value="code" displayed-value="" :show-icon="true" />
    </div>
  </div>
</template>

<style scoped>
pre {
  margin: 0;
  font-family: monospace;
  white-space: pre-line;
}
code {
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
