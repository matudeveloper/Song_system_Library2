import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const sessionId = ref();    
  return { sessionId }
})