<template>
  <div>
    <review-status-icon
      :status="item.id"
      :size="16"
      class="mx-2"
    />
    {{ item.label }}
  </div>
</template>

<script setup>
import ReviewStatusIcon from "@/components/Icons/ReviewStatusIcon.vue";

defineProps({
  item: { type: Object, required: true }
});
</script>
