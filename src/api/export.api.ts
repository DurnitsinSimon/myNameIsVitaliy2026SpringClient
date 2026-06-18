import { api } from './client';
import type { ExportFormat } from '@/types';

export const exportApi = {
  /** Скачивает документ объекта в выбранном формате. */
  download: async (objectId: string, format: ExportFormat) => {
    const response = await api.get(`/export/${objectId}`, {
      params: { format },
      responseType: 'blob',
    });

    const contentType = String(response.headers['content-type'] ?? '');
    const blob = new Blob([response.data], { type: contentType });

    // Извлекаем имя файла из заголовка Content-Disposition.
    const disposition = response.headers['content-disposition'] as
      | string
      | undefined;
    let filename = `object.${format}`;
    if (disposition) {
      const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)/i.exec(disposition);
      if (match?.[1]) filename = decodeURIComponent(match[1]);
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
