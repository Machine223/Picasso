import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Strokes } from '../../../../../constants/constants';
import { Shape } from '../shape';

export class Rectangle extends Shape {
    width: number;
    height: number;
    strokeType: string;

    constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
        super(colorsService, toolProperties);
        this.strokeType = this.toolProperties.strokeType;
        this.strokeTypeDispatcher(this.strokeType);
    }

    strokeTypeDispatcher(strokeType: string): void {
        const mapStrokeTypeDispatcher = new Map<string , () => void>();
        mapStrokeTypeDispatcher.set(Strokes.Outline, () =>  {
            this.fill = 'none';
            this.stroke = this.colorsService.getSecondaryColorRGBA();
        });
        mapStrokeTypeDispatcher.set(Strokes.Full, () => {
            this.stroke = 'none';
            this.fill = this.colorsService.getMainColorRGBA();
        });
        mapStrokeTypeDispatcher.set(Strokes.Both, () => {
            this.fill = this.colorsService.getMainColorRGBA();
            this.stroke = this.colorsService.getSecondaryColorRGBA();
        });
        (mapStrokeTypeDispatcher.get(strokeType) || (() => null))();
    }

    cloneRectangle(rectangle: Rectangle): void {
      this.cloneShape(rectangle);
      this.width = rectangle.width;
      this.height = rectangle.height;
      this.strokeType = rectangle.strokeType;
      if (this.strokeType === Strokes.Full) {
        this.strokeWidth = 0;
      }
    }
}
