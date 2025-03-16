<script setup lang="ts">
import { Header, Login } from "@/components";

defineProps<{}>();
defineEmits<{}>();
</script>

<template>
  <div class="container">
    <Header />

    <slot />

    <Login />
  </div>
</template>

<style scoped>
.container {
  width: 913px;
  height: auto;
  margin: auto;
  overflow: hidden;
  min-height: 830px;

  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
  }
}
</style>
