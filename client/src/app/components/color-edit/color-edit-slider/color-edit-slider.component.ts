import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener, Output,
  ViewChild,
} from '@angular/core';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { BaseColors } from '../../../../constants/constants';

enum ColorSlider {StartRed = 0, Yellow = 0.17, Green = 0.34, Teal = 0.5, Blue = 0.67, Purple = 0.83, EndRed = 1}
const X_OFFSET = 25;

@Component({
  selector: 'app-color-edit-slider',
  templateUrl: './color-edit-slider.component.html',
  styleUrls: ['./color-edit-slider.component.scss']
})
export class ColorEditSliderComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false, read: ElementRef})
  canvas: ElementRef;

  @Output()
  color: EventEmitter<string> = new EventEmitter();

  context: CanvasRenderingContext2D;
  mouseDown: boolean;
  private selectedHeight: number;

  constructor(private colorsService: ColorsService) {
    this.mouseDown = false;
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {
    if (!this.context) {
      this.context = this.canvas.nativeElement.getContext('2d');
    }

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    this.context.clearRect(0, 0, width, height);

    const gradient = this.context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(ColorSlider.StartRed, BaseColors.Red);
    gradient.addColorStop(ColorSlider.Yellow, BaseColors.Yellow);
    gradient.addColorStop(ColorSlider.Green, BaseColors.Green);
    gradient.addColorStop(ColorSlider.Teal, BaseColors.Teal);
    gradient.addColorStop(ColorSlider.Blue, BaseColors.Blue);
    gradient.addColorStop(ColorSlider.Purple, BaseColors.Purple);
    gradient.addColorStop(ColorSlider.EndRed, BaseColors.Red);

    this.context.beginPath();
    this.context.rect(0, 0, width, height);

    this.context.fillStyle = gradient;
    this.context.fill();
    this.context.closePath();

    if (this.selectedHeight) {
      this.selectedHeightDraw(width);
    }
  }

  selectedHeightDraw(width: number): void {
    const lineWidth = 5;
    const lineHeight = 10;

    this.context.beginPath();
    this.context.strokeStyle = 'white';
    this.context.lineWidth = lineWidth;
    this.context.rect(0, this.selectedHeight - lineWidth, width, lineHeight);
    this.context.stroke();
    this.context.closePath();
  }

  onMouseDown(evt: MouseEvent): void {
    this.mouseDown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(X_OFFSET, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mouseDown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(X_OFFSET, evt.offsetY);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(): void {
    this.mouseDown = false;
  }

  emitColor(x: number, y: number): void {
    const rgbColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbColor);
  }

  getColorAtPosition(x: number, y: number): string {
    const imageData = this.context.getImageData(x, y, 1, 1).data;
    return this.colorsService.getNumbersAsColor(imageData);
  }
}
