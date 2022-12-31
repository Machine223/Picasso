import { Injectable } from '@angular/core';
import { ColorsService } from '../colors/colors.service';

@Injectable({
  providedIn: 'root'
})
export class ColorToolService {
  isIn: boolean;

  constructor(protected colorsService: ColorsService) {
    this.isIn = false;
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher  = new Map<string, () => void> ();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown());
    mapTypeDispatcher.set('mouseup', () => this.onMouseUp(event));
    mapTypeDispatcher.set('mouseleave', () => this.onMouseLeave());
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(): void {
    this.isIn = true;
  }

  onMouseUp(event: MouseEvent): void {
    return;
  }

  onMouseLeave(): void {
    this.isIn = false;
  }
}
