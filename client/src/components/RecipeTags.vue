<script setup lang="ts">
import { computed } from 'vue';
import { getTagColorClassByName } from '@/config/tags';

const props = defineProps<{
  tags?: string[];
}>();

const hasTags = computed(() => props.tags && props.tags.length > 0);

</script>

<template>
  <div v-if="hasTags" class="recipe-tags">
    <span
      v-for="(tag, index) in props.tags"
      :key="index"
      class="tag"
      :class="getTagColorClassByName(tag)"
    >
      {{ tag }}
    </span>
  </div>
</template>

<style scoped>
.recipe-tags {
  margin-bottom: 0.6rem;
}

.tag-color-1 { background-color: var(--tag-color-1-bg); color: var(--tag-color-1-text); }
.tag-color-2 { background-color: var(--tag-color-2-bg); color: var(--tag-color-2-text); }
.tag-color-3 { background-color: var(--tag-color-3-bg); color: var(--tag-color-3-text); }
.tag-color-4 { background-color: var(--tag-color-4-bg); color: var(--tag-color-4-text); }
.tag-color-5 { background-color: var(--tag-color-5-bg); color: var(--tag-color-5-text); }
.tag-color-6 { background-color: var(--tag-color-6-bg); color: var(--tag-color-6-text); }
</style>
