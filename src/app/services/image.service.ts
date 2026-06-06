import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';

@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(private api: ApiCallService) { }

  getFullImageUrl(url: any): string {
    if (!url) return url;
    const raw = String(url);
    if (/^https?:\/\//i.test(raw)) return raw;
    const endpoint = this.api?.s3Endpoint || '';
    if (!endpoint) return raw;
    if (raw.startsWith('/')) {
      return endpoint.replace(/\/$/, '') + raw;
    }
    return endpoint.replace(/\/$/, '') + '/' + raw;
  }

  normalizeImages(images: any): any[] {
    if (!images) return [];
    let imgs: any = images;
    if (typeof imgs === 'string') {
      try {
        imgs = JSON.parse(imgs);
      } catch (e) {
        imgs = [imgs];
      }
    }
    if (!Array.isArray(imgs)) imgs = [imgs];

    return imgs.map((img: any, idx: number) => {
      if (typeof img === 'string') {
        return { url: this.getFullImageUrl(img), order: idx + 1 };
      }
      if (img && img.url) {
        img.url = this.getFullImageUrl(img.url);
        return img;
      }
      return { url: this.getFullImageUrl(img), order: idx + 1 };
    });
  }
}
