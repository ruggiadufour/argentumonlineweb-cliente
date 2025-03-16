import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  experimental: {
    renderJsonPayloads: true
  },

  future: {
      compatibilityVersion: 4,
  },

  compatibilityDate: "2025-03-16",
})