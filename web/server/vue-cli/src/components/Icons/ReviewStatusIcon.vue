<template>
  <v-icon
    v-if="currentStatus"
    :color="currentStatus.color"
    :title="currentStatus.title"
    :size="size"
    :icon="currentStatus.icon"
  />
</template>

<script setup>
import { computed } from "vue";
import { ReviewStatus } from "@cc/report-server-types";

const props = defineProps({
  status: { type: Number, required: true },
  size: { type: String, default: "medium" }
});

const reviewStatusInfo = {
  [ReviewStatus.UNREVIEWED]: {
    color: "#4b9fd5",
    title: "Unreviewed",
    icon: "mdi-eye-off"
  },
  [ReviewStatus.CONFIRMED]: {
    color: "#e92625",
    title: "Confirmed",
    icon: "mdi-check-circle-outline"
  },
  [ReviewStatus.FALSE_POSITIVE]: {
    color: "#808080",
    title: "False positive",
    icon: "mdi-cancel"
  },
  [ReviewStatus.INTENTIONAL]: {
    color: "#669603",
    title: "Intentional",
    icon: "mdi-close-circle-outline"
  }
};

const currentStatus = computed(function() {
  return reviewStatusInfo[parseInt(props.status)];
});
</script>
