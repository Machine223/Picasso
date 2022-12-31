import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { OpenDialogService } from '@app-services/open-dialog/open-dialog.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})

export class ColorPickerComponent {

  constructor(public overlay: Overlay,
              private colorsService: ColorsService,
              public openDialogService: OpenDialogService) {}

  onRightClick(index: number): boolean {
    this.colorsService.presetSecondaryColorUse(index);
    return false;
  }

  openColorEditPanel(color: string): void {
    this.colorsService.currentColor = color;
    this.openDialogService.openColorDialog(this.colorsService.createColorReference(color));
  }
}
