import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Input, OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { BaseColors } from '../../../../constants/constants';

@Component({
  selector: 'app-color-edit-palette',
  templateUrl: './color-edit-palette.component.html',
  styleUrls: ['./color-edit-palette.component.scss']
})
export class ColorEditPaletteComponent implements AfterViewInit, OnChanges {
  @Input()
  hue: string;

  @Output()
  color: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  context: CanvasRenderingContext2D;
  mouseDown: boolean;
  selectedPosition: Coordinates;

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

    this.context.fillStyle = this.hue || this.colorsService.getColorAsRGBa(BaseColors.White, 1);
    this.context.fillRect(0, 0, width, height);

    const whiteGrad = this.context.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, this.colorsService.getColorAsRGBa(BaseColors.White, 1));
    whiteGrad.addColorStop(1, this.colorsService.getColorAsRGBa(BaseColors.White, 0));

    this.context.fillStyle = whiteGrad;
    this.context.fillRect(0, 0, width, height);

    const blackGrad = this.context.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, this.colorsService.getColorAsRGBa(BaseColors.Black, 0));
    blackGrad.addColorStop(1, this.colorsService.getColorAsRGBa(BaseColors.Black, 1));

    this.context.fillStyle = blackGrad;
    this.context.fillRect(0, 0, width, height);

    if (this.selectedPosition) {
      this.selectedPositionDraw();
    }
  }

  selectedPositionDraw(): void {
    const lineWidth = 5;
    const arcRadius = 10;
    const fullCircle = 2 * Math.PI;

    this.context.strokeStyle = 'white';
    this.context.fillStyle = 'white';
    this.context.beginPath();
    this.context.arc(
      this.selectedPosition.xPosition,
      this.selectedPosition.yPosition,
      arcRadius,
      0,
      fullCircle
    );
    this.context.lineWidth = lineWidth;
    this.context.stroke();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hue) {
      this.draw();
      const pos = this.selectedPosition;
      if (pos) {
        this.color.emit(this.getColorAtPosition(pos.xPosition, pos.yPosition));
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(): void {
    this.mouseDown = false;
  }

  onMouseDown(evt: MouseEvent): void {
    this.mouseDown = true;
    this.selectedPosition = new Coordinates(evt.offsetX, evt.offsetY);
    this.draw();
    this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mouseDown) {
      this.selectedPosition = new Coordinates(evt.offsetX, evt.offsetY);
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
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
