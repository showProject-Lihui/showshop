import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/css/global.css"
import TreeTable from "vue-table-with-tree-grid"
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//全局过滤时间
Vue.filter('dateFormat',function(option) {
  const dt = new Date(option)
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2,"0");
  const d = (dt.getDate() + '').padStart(2,'0');
  const hh = (dt.getHours() + '').padStart(2,'0');
  const mm = (dt.getMinutes() + '').padStart(2,'0');
  const s = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${s}`
})

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component("tree-table",TreeTable )

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
