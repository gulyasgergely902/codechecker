<template>
  <span>
    <v-alert
      dismissible
      color="success"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-check"
      v-on="success"
    >
      {{ successMsg }}
    </v-alert>

    <v-alert
      dismissible
      color="error"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-alert-outline"
      v-on="error"
    >
      {{ errorMsg }}
    </v-alert>
  </span>
</template>

<script>
export default {
  name: "Alerts",
  props: {
    success: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    successMsg: { type: String, default: null },
    errorMsg: { type: String, default: null }
  }
};
</script>