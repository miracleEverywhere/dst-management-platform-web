import { ElMessage } from 'element-plus'
import {computed} from "vue";
import useGlobalStore from "@/stores/modules/global.ts";

export default {
  mounted(el, binding) {
    const globalStore = useGlobalStore();
    const language = computed(() => globalStore.language);
    el.$value = binding.value
    el.handler = () => {
      const textarea = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      const result = document.execCommand('Copy')
      if (result) {
        let message
        if (language.value === 'zh') {
          message = '复制成功'
        } else {
          message = 'Copy successful'
        }
        ElMessage.success({message: message, plain: true})
      }
      document.body.removeChild(textarea)
    }
    el.addEventListener('click', el.handler)
  },
  updated(el, binding){
    el.$value = binding.value
  },
  unmounted(el){
    el.removeEventListener('click', el.handler)
  }
}
