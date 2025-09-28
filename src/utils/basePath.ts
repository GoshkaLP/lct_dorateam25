/**
 * Утилита для определения базового пути в зависимости от окружения
 */

export function getBasePath(): string {
  // Для сборки production определяем базовый путь для GitHub Pages
  if (typeof window !== 'undefined') {
    const pathParts = window.location.pathname.split('/').filter(part => part);
    
    // Если это GitHub Pages (содержит github.io в hostname)
    if (window.location.hostname.includes('github.io') && pathParts.length > 0) {
      return '/' + pathParts[0];
    }
  }
  
  // Для локальной разработки возвращаем пустую строку
  return '';
}

/**
 * Получает полный URL с учётом базового пути
 */
export function getFullUrl(relativePath: string): string {
  const basePath = getBasePath();
  return basePath + relativePath;
}
