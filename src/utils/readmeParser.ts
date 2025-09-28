/**
 * Утилита для парсинга README.md файла
 */

import { getFullUrl } from './basePath';

export async function getFirstLineFromReadme(): Promise<string> {
  try {
    // Используем утилиту для получения правильного пути с учётом базового пути
    const readmeUrl = getFullUrl('/README.md');
    const response = await fetch(readmeUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Находим первую непустую строку
    const firstLine = lines.find(line => line.trim() !== '');
    
    // Убираем markdown символы # из заголовка
    return firstLine ? firstLine.replace(/^#+\s*/, '') : 'Название';
  } catch (error) {
    return 'Название'; // fallback значение
  }
}
