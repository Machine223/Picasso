import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

export class Path {
    strokeWidth: number;
    color: string;
    strokeLine: string;
    currentPath: string;
    circlePoint: Coordinates;
    circleWidth: number;
    textureType: number;

    constructor(protected colorService: ColorsService, protected toolProperties: ToolPropertiesService) {
        this.strokeWidth = this.toolProperties.strokeWidth;
        this.circleWidth = this.toolProperties.strokeWidth / 2;
        this.strokeLine = 'round';
        this.currentPath = '';
        this.textureType = 0;
    }

    getColor(): string {
        return this.colorService.getMainColorRGBA();
    }
}
