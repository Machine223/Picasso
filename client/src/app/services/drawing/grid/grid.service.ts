import { Injectable } from '@angular/core';

export const INCREMENT_SIZE = 5;
export const DEFAULT_GRID_LENGTH = 5;
export const DEFAULT_OPACITY = 0.5;
export const GRID_MAX = 500;
@Injectable({
  providedIn: 'root'
})
export class GridService {

  gridLength: number;
  pathString: string;
  gridOpacity: number;

  constructor() {
    this.setDefaultValues();
    this.pathToString();
  }

  setDefaultValues(): void {
    this.gridLength = DEFAULT_GRID_LENGTH;
    this.gridOpacity = DEFAULT_OPACITY;
  }

  increment(): void {

    if (this.gridLength > GRID_MAX - INCREMENT_SIZE) { return; }
    this.gridLength += INCREMENT_SIZE;
    this.pathToString();
  }

  decrement(): void {
    if (this.gridLength < 2 * INCREMENT_SIZE) { return; }
    this.gridLength -= INCREMENT_SIZE;
    this.pathToString();
  }

  pathToString(): void {
    this.pathString = 'M ' + this.gridLength + ' 0 L 0 0 0 ' + this.gridLength;
  }
}
