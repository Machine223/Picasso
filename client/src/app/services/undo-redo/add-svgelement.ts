import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { ICommand } from './icommand';

export class AddSVGElement implements ICommand {
    drawingElement: SVGElement;

    constructor(inputDrawingElement: SVGElement, private drawingElementsService: DrawingElementsService) {
      this.drawingElement = inputDrawingElement;
    }

    execute(): void {
        this.drawingElementsService.completedRenderer.next(this.drawingElement);
    }

    undo(): void {
        this.drawingElementsService.elementToDelete.next(this.drawingElement);
    }
}
