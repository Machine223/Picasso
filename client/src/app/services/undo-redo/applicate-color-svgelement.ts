import { ICommand } from '@app-services/undo-redo/icommand';

export class ApplicateColorSvgelement implements ICommand {

  elementsToChangeColor: SVGElement[];
  previousColor: string | null;
  nextColor: string;
  surface: string;

  constructor(elementsToChange: SVGElement[], nextColor: string, surface: string) {
    this.elementsToChangeColor = elementsToChange;
    this.nextColor = nextColor;
    this.surface = surface;
    this.previousColor = this.getPreviousColor();
  }

  execute(): void {
    this.elementsToChangeColor.forEach((element) => {
      element.setAttribute(this.surface, this.nextColor);
    });
  }

  undo(): void {
    this.elementsToChangeColor.forEach((element) => {
      if (!this.previousColor) {
        this.previousColor = 'none';
      }
      element.setAttribute(this.surface, this.previousColor);
    });
  }

  getPreviousColor(): string | null {
    return this.elementsToChangeColor[0].getAttribute(this.surface) || this.elementsToChangeColor[1].getAttribute(this.surface);
  }
}
