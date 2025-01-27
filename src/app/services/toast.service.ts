import { Injectable, Renderer2, RendererFactory2, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private renderer: Renderer2;
	 toasts: any[] = [];

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  createToast(message: string, duration: number = 5000) {
    const toastElement = this.renderer.createElement('div');
    toastElement.classList.add('popup');
    toastElement.innerHTML = message;

    this.renderer.appendChild(document.body, toastElement);

    setTimeout(() => {
      this.renderer.removeChild(document.body, toastElement);
    }, duration);
  }
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    	 	 this.toasts.push({ textOrTpl, ...options });
    	 }
    
    	 remove(toast:any) {
    	 	 this.toasts = this.toasts.filter((t) => t !== toast);
    	 }
    
    	 clear() {
    	 	 this.toasts.splice(0, this.toasts.length);
    	 }
      info(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    	 	 this.toasts.push({ textOrTpl, ...options });
    	 }
}