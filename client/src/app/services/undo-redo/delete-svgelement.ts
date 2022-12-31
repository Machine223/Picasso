import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';

export class DeleteSVGElement {
  selectedElements: SVGGElement[];
  constructor(selectedElements: SVGGElement[], private drawingElements: DrawingElementsService) {
    this.selectedElements = selectedElements;
  }

  execute(): void {
    this.selectedElements.forEach((element) => {
      this.drawingElements.elementToDelete.next(element);
    });
  }

  undo(): void {
    this.selectedElements.forEach((element) => {
      this.drawingElements.completedRenderer.next(element);
    });
  }
}
