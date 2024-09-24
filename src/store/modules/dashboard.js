import {defineStore} from "pinia";
import {piniaPrefixKey} from "@/settings.js";

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({

  }),
  actions: {

  },
  persist: {
    key: piniaPrefixKey + 'dashboard',
  },
})
