import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Загружаем переменные окружения из корня проекта
  const env = loadEnv(mode, process.cwd(), '')
  
  // Отладочная информация о загрузке env файлов  
  return {
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'README.md', dest: 'dist' }
      ],
      hook: 'writeBundle'
    })
  ],
    // Базовый путь для GitHub Pages (замени 'temp_code_repository' на название твоего репозитория)
    base: env.NODE_ENV === 'production' ? '/temp_code_repository/' : '/',
    server: {
      port: 3000,
      open: true
    },
    publicDir: 'public',
    assetsInclude: ['**/*.md'],
    
    // Настройки переменных окружения
    envDir: process.cwd(), // Корень проекта для поиска .env файлов
    envPrefix: ['VITE_'], // Префикс для переменных, доступных в клиенте
    
    // Порядок загрузки .env файлов:
    // 1. .env.local (игнорируется git, для локальных настроек)
    // 2. .env.development.local (mode-specific, игнорируется git)
    // 3. .env.development (mode-specific)  
    // 4. .env (общие настройки)
    
    // Определяем переменные для процесса сборки
    define: {
      __ENV__: JSON.stringify(env),
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})
