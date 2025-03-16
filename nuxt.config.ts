import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@sidebase/nuxt-session'],
  experimental: {
    renderJsonPayloads: true
  },
  extends: "../.nuxt/tsconfig.server.json",
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2025-03-16",
  session: {
    name: 'nuxt-session',
    password: process.env.SESSION_SECRET || 'super-secret-key',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  },
  nitro: {
    cookieSecret: 'this-is-a-secure-session-key-that-is-at-least-32-chars-long',
    cookieName: 'nuxt-session'
  }
});