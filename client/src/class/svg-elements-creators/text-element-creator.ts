import { RendererFactory2 } from '@angular/core';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Cursor } from 'class/cursor';
import { Text } from '../../app/services/drawing/text/text';
import { SVGElementCreator } from './svg-element-creator';

const DEFAULT_BORDER_WIDTH = 5;

export class TextElementCreator extends SVGElementCreator {

  cursor: Cursor;
  text: Text;
  textbox: Rectangle;
  textboxElement: SVGElement;
  borderWidth: number;
  currentLine: number;
  currentChar: number;

  constructor(protected rendererFactory: RendererFactory2,
              private colorsService: ColorsService,
              private toolProperties: ToolPropertiesService) {
    super(rendererFactory);
    this.textbox = new Rectangle(colorsService, toolProperties);
    this.borderWidth = DEFAULT_BORDER_WIDTH;
  }

  createNewTextElement(textProperties: Text): SVGElement {
    this.text = new Text(this.colorsService, this.toolProperties);
    textProperties.textBody = ['|'];
    textProperties.lines = textProperties.textBody.length;
    this.cursor = new Cursor();
    this.currentLine = 0;
    this.currentChar = 0;
    return this.updateTextInElement(textProperties);
  }

  updateTextInElement(textProperties: Text): SVGElement {
    const textBox = this.createTextBox(textProperties);
    textProperties.startingPoint.yPosition += textProperties.fontSize;
    const textBodies = this.createTextBodies(textProperties);
    textProperties.startingPoint.yPosition -= textProperties.fontSize;
    this.text = textProperties;

    const wrapper = super.createTextWrapper(textBodies, textBox);
    this.renderer.setStyle(wrapper, 'text-align', textProperties.alignment);
    return wrapper;
  }

  createTextBodies(textProperties: Text): SVGElement[] {
    const textElements = [];
    const originalYPosition = textProperties.startingPoint.yPosition;
    for (let i = 0; i < textProperties.lines; i++) {
        textElements[i] = super.createText(textProperties, i);
        textProperties.startingPoint.yPosition += textProperties.fontSize;
    }
    textProperties.startingPoint.yPosition = originalYPosition;
    return textElements;
  }

  createTextBox(textProperties: Text): SVGElement {
    const rectangle = new Rectangle(this.colorsService, this.toolProperties);
    let mostCharsInLine = 1;
    for (const line of textProperties.textBody) {
        if (line.length > mostCharsInLine) {
            mostCharsInLine = line.length;
        }
    }
    rectangle.width = 2 * this.borderWidth + textProperties.fontSize * mostCharsInLine;
    rectangle.height = textProperties.fontSize * textProperties.lines + 2 * this.borderWidth;
    rectangle.startingPoint.xPosition = textProperties.startingPoint.xPosition;
    rectangle.startingPoint.yPosition = textProperties.startingPoint.yPosition;
    rectangle.stroke = 'gray';
    rectangle.fill = 'rgb(0,0,0,0)';
    rectangle.strokeWidth = 2;
    this.textbox = rectangle;
    this.textboxElement = super.createRectangle(rectangle);
    return this.textboxElement;
  }

  removeTextBox(wrapper: SVGElement): SVGElement {
    wrapper.removeChild(this.textboxElement);
    return wrapper;
  }

  isMouseInTextbox(event: MouseEvent): boolean {
    return this.isWithinX(event) && this.isWithinY(event);
  }

  isWithinX(event: MouseEvent): boolean {
    return (event.offsetX >= this.text.startingPoint.xPosition &&
      event.offsetX < this.text.startingPoint.xPosition + this.textbox.width);
  }

  isWithinY(event: MouseEvent): boolean {
    return (event.offsetY >= this.text.startingPoint.yPosition &&
      event.offsetY < this.text.startingPoint.yPosition + this.textbox.height);
  }

  addLetter(event: KeyboardEvent): void {
    let tempText = '';
    for (let i = 0; i < this.text.textBody[this.currentLine].length; i++) {
      if (i === this.currentChar) {
        tempText += event.key;
      }
      tempText += this.text.textBody[this.currentLine][i];
    }
    this.text.textBody[this.currentLine] = tempText;
    this.currentChar++;
    this.updateTextInElement(this.text);
  }

  removeLetter(relativePosition: number): void {
    const position = this.currentChar + relativePosition;
    if (relativePosition === 0 || this.isAllowedToBackspace(relativePosition) || this.isAllowedToDelete(relativePosition)) {
      let tempText = '';
      for (let i = 0; i < this.text.textBody[this.currentLine].length; i++) {
        if (i !== position) {
          tempText += this.text.textBody[this.currentLine][i];
        }
      }
      this.text.textBody[this.currentLine] = tempText;
      if (relativePosition === -1) {			// Cursor only decrements of horiz. index when backspacing, not deleting
        this.currentChar--;
      }
    }
    if (this.isAllowedToRemoveLine(relativePosition)) {
      this.moveCursorUp();
      for (let i = 0; i < this.text.textBody[this.currentLine].length - 1; i++) {
        this.moveCursorRight();
      }
      this.text.textBody[this.currentLine] += this.text.textBody[this.currentLine + 1];
      this.text.textBody.splice(1, 1);
      this.text.lines--;
    }
    this.updateTextInElement(this.text);
  }

  isAllowedToBackspace(relativePosition: number): boolean {
    return relativePosition === -1 && this.currentChar > 0;
  }

  isAllowedToDelete(relativePosition: number): boolean {
    return relativePosition > 0 && this.text.textBody[this.currentLine].length > 0;
  }

  isAllowedToRemoveLine(relativePosition: number): boolean {
    return this.currentLine > 0 && this.currentChar === 0 && relativePosition === -1;
  }

  moveCursorRight(): void {
    if (this.currentChar < this.text.textBody[this.currentLine].length - 1) {
      this.text.textBody[this.currentLine] = this.cursor.moveRight(this.text.textBody[this.currentLine], this.currentChar);
      this.currentChar++;
    }
  }

  moveCursorLeft(): void {
    if (this.currentChar > 0) {
      this.text.textBody[this.currentLine] = this.cursor.moveLeft(this.text.textBody[this.currentLine], this.currentChar);
      this.currentChar--;
    }
  }

  moveCursorUp(): void {
    if (this.currentLine > 0) {
      const linesToSwap = [this.text.textBody[this.currentLine - 1], this.text.textBody[this.currentLine]];
      const swappedLines = this.cursor.moveUp(linesToSwap, [this.currentLine, this.currentChar]);
      this.text.textBody[this.currentLine - 1] = swappedLines[0];
      this.text.textBody[this.currentLine] = swappedLines[1];
      this.currentLine--;
      this.currentChar = this.cursor.localIndex[1];
    }
  }

  moveCursorDown(): void {
    if (this.currentLine < this.text.lines - 1) {
      const linesToSwap = [this.text.textBody[this.currentLine], this.text.textBody[this.currentLine + 1]];
      const swappedLines = this.cursor.moveDown(linesToSwap, [this.currentLine, this.currentChar]);
      this.text.textBody[this.currentLine] = swappedLines[0];
      this.text.textBody[this.currentLine + 1] = swappedLines[1];
      this.currentLine++;
      this.currentChar = this.cursor.localIndex[1];
    }
  }

  addLineBelow(): void {
    const splittedText = ['', ''];
    for (let i = 0; i < this.text.textBody[this.currentLine].length; i++) {
      if (i < this.currentChar) {
        splittedText[0] += this.text.textBody[this.currentLine][i];
      } else {
        splittedText[1] += this.text.textBody[this.currentLine][i];
      }
    }
    this.text.textBody[this.currentLine] = splittedText[0];
    this.text.textBody[this.currentLine + 1] = splittedText[1];
    this.currentChar = 0;
    this.currentLine++;
    this.text.lines++;
  }
}
