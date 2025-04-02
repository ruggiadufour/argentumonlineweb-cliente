<script setup lang="ts">
import { useAuthStore } from './store/auth.store';

const authStore = useAuthStore();
await useFetch("/api/auth/is_logged", {
    async onResponse({ response }) {
        const result = response._data;
        if(result.success) {
            authStore.account = result.data.user;
        }
    }
})
</script>

<template>
    <nuxt-page />
</template>

<style>

:root {
    --background-color-1: #15110c;
    --background-color-2: #221b16;
    --text-color-1: #aa967f;
    --text-color-inverted-1: #15110c;
    --background-color-inverted-1: #aa967f;
    --border-color-1: #15110c;
    --border-color-inverted-1: #aa967f;
}

body,
html {
    margin: 0;
    padding: 0;
    font-family: Arial;

    background-color: var(--background-color-2);
    /* background-image: url("/static/imgs/background.jpg"); */
    background-repeat: no-repeat;
    background-position: center top;
}

*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-track {
  background: var(--border-color-inverted-1);
  border-radius: 2px;
}

*::-webkit-scrollbar-thumb {
  background: var(--background-color-1);
  border-radius: 2px;
  border: 1px solid var(--border-color-inverted-1);
}

@supports not selector(::-webkit-scrollbar) {
  * {
    scrollbar-color: var(--background-color-1)
                     var(--border-color-inverted-1);
  }
}
</style>