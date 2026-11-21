<script setup lang="ts">
import { inject, type Ref } from 'vue';

defineProps<{ value: string }>();
const active = inject<Ref<string>>('docs-tabs-active');
</script>

<template>
  <div v-show="active === value" role="tabpanel" class="docs-tab-item">
    <slot />
  </div>
</template>
