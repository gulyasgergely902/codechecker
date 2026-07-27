<template>
  <div>
    <v-avatar
      left
      :size="16"
    >
      <confidentiality-icon
        :value="confidentialityFromStringToCode(value)"
        size="small"
      />
    </v-avatar>
    {{ value }}
  </div>
</template>

<script setup>
import { useConfidentiality } from "@/composables/useConfidentiality";

import ConfidentialityIcon from "@/components/Icons/ConfidentialityIcon.vue";

defineProps({
  value: { type: String, required: true }
});

const {
  confidentialityFromStringToCode 
} = useConfidentiality();

</script>

