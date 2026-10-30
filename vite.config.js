import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

// import { compression } from 'vite-plugin-compression2'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const projectRoot = fileURLToPath(new URL('./', import.meta.url))

// 自定义插件：将 configFile @use 注入到 Vuetify 的 SASS 文件
// 替代 vite-plugin-vuetify 的 styles.configFile 方案，避开其虚拟模块 tempFiles Map 的竞争条件
function vuetifyConfigStyles(configFilePath) {
  let configFileAbsolute

  return {
    name: 'vuetify:config-styles',
    enforce: 'pre',
    configResolved(config) {
      configFileAbsolute = path.resolve(config.root, configFilePath)
    },
    transform(code, id) {
      if (!id.includes('node_modules/vuetify/')) return null
      if (!id.endsWith('.sass') && !id.endsWith('.scss')) return null
      const suffix = id.endsWith('.scss') ? ';\n' : '\n'

      const fileUrl = pathToFileURL(configFileAbsolute).href

      return `@use '${fileUrl}' as *${suffix}${code}`
    },
  }
}

export default defineConfig(({ mode }) => {
  // 与运行时 src/config 的 IsLite 读取同一个变量，保证构建期与运行期判断一致
  const env = loadEnv(mode, projectRoot, '')
  const isLite = env.VITE_APP_MODE === 'lite'

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
    },
    plugins: [
      vue(),

      // Vuetify 插件应该在 vue() 之后立即加载
      // 使用 styles: 'sass' 直接解析而非虚拟模块，避免 tempFiles 竞争导致 404
      // 自定义变量注入由上面的 vuetifyConfigStyles 插件完成
      vuetify({
        autoImport: true,
        styles: 'sass',
      }),
      vuetifyConfigStyles('src/assets/styles/variables/_vuetify.scss'),
      vueJsx(),

      // compression({
      //   algorithms: ['gzip'],
      // }),
      ViteImageOptimizer(),
      Components({
        dirs: ['src/@core/components', 'src/components'],
        dts: true,
        resolvers: [
          componentName => {
            if (componentName === 'VueApexCharts')
              return { name: 'default', from: 'vue3-apexcharts', as: 'VueApexCharts' }
          },
        ],
      }),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
        vueTemplate: true,
        ignore: ['useCookies', 'useStorage'],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
        },
      }),
      svgLoader(),
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/assets/styles/', import.meta.url)),
        '@store': fileURLToPath(new URL('./src/plugins/store/', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./src/assets/styles/variables/_template.scss', import.meta.url)),

        // 视图注册表：构建期按形态二选一（standard / lite），
        // 未选中的视图不会被 import.meta.glob 收进模块图，也就不会产出 chunk
        '@views-registry': fileURLToPath(new URL(
          isLite ? './src/plugins/router/views.lite.js' : './src/plugins/router/views.js',
          import.meta.url,
        )),
      },
    },
    build: {
      chunkSizeWarningLimit: 500,
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './src/**/*.vue',
      ],
    },
  }
})
