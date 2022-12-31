import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Path } from '../path';

export class Brush extends Path {

  constructor(protected colorService: ColorsService, protected toolProperties: ToolPropertiesService) {
    super(colorService, toolProperties);
    this.textureType = this.toolProperties.textureType;
  }
}
