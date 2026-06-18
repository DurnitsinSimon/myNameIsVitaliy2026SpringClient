import { api } from './client';
import type { Media, UploadMediaPayload } from '@/types';

export const mediaApi = {
  listByObject: (objectId: string) =>
    api.get<Media[]>(`/media/object/${objectId}`).then((r) => r.data),

  upload: (payload: UploadMediaPayload) => {
    const form = new FormData();
    form.append('file', payload.file);
    form.append('objectId', payload.objectId);
    form.append('type', payload.type);
    if (payload.altText !== undefined) form.append('altText', payload.altText);
    if (payload.caption !== undefined) form.append('caption', payload.caption);
    if (payload.sortOrder !== undefined)
      form.append('sortOrder', String(payload.sortOrder));
    if (payload.useOnSite !== undefined)
      form.append('useOnSite', String(payload.useOnSite));
    if (payload.useInPptx !== undefined)
      form.append('useInPptx', String(payload.useInPptx));
    if (payload.useInPortfolio !== undefined)
      form.append('useInPortfolio', String(payload.useInPortfolio));

    return api
      .post<Media>('/media/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  remove: (id: string) => api.delete(`/media/${id}`).then((r) => r.data),
};
