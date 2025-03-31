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
}

body,
html {
    margin: 0;
    padding: 0;
    font-family: Arial;

    background-color: #131920;
    background-image: url("/static/imgs/background.jpg");
    background-repeat: no-repeat;
    background-position: center top;
}
</style>