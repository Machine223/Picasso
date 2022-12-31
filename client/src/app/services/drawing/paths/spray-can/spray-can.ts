import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Path } from '../path';

export class SprayCan extends Path {
    interval: number;
    intervalTime: number;
    jetRadius: number;
    densityDot: number;
    dotWidth: number;
    cursorColor: string;

    constructor(protected colorService: ColorsService, protected toolProperties: ToolPropertiesService) {
        super(colorService, toolProperties);
        const densityDot = 20;
        this.jetRadius = this.toolProperties.dotSprayDiameter;
        this.densityDot = densityDot;
        this.dotWidth = 2;
        this.cursorColor = 'grey';
    }

    getDotSprayDiameter(): number {
        this.jetRadius = this.toolProperties.dotSprayDiameter;
        return this.toolProperties.dotSprayDiameter;
    }

    getDotSprayInterval(): number {
      const maxValue = 100;
      this.intervalTime = maxValue - this.toolProperties.dotSprayInterval;
      return this.intervalTime;
    }
}
