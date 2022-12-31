import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ColorsService } from '../colors/colors.service';
import { ToolPropertiesService } from '../tools/tool-properties.service';
import { Path } from './path';

export class PaintBucketPath extends Path {
  fill: string;

  constructor(protected colorService: ColorsService, protected toolProperties: ToolPropertiesService, fill: string) {
    super(colorService, toolProperties);
    this.fill = fill;
    this.strokeWidth = 0;
    this.strokeLine = 'none';
    this.circlePoint = new Coordinates(0, 0);
    this.color = 'none';
  }
}
