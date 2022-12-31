import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingZonePropertiesService {

  isMouseIn: boolean;

  constructor() {
    this.isMouseIn = false;
  }

  setIsMouseIn(event: MouseEvent): void {
    if (!this.isMouseIn && event.type === 'mouseenter') {
      this.isMouseIn = true;
    } else if (this.isMouseIn && event.type === 'mouseleave') {
      this.isMouseIn = false;
    }
  }
}
