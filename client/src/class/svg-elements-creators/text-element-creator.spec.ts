import { RendererFactory2 } from '@angular/core';
import { inject } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Text } from '@app-services/drawing/text/text';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Cursor } from 'class/cursor';
import { TextElementCreator } from './text-element-creator';

const BACKSPACE_RELATIVE_POSITION = -1;
const DELETE_RELATIVE_POSITION = 1;

describe('TextElementCreator', () => {

  let instance: TextElementCreator;

  beforeEach(inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      instance = new TextElementCreator(renderer, colorsService, toolProperties);
  }));

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#moveCursorRight should swap cursor with character to the right in textBody if possible',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello!|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello|!'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.moveCursorRight();
      const firstSwap = instance.text.textBody;
      expect(firstSwap).toEqual(expectedResult);
      instance.moveCursorRight();
      const secondSwap = instance.text.textBody;
      expect(secondSwap).toEqual(expectedResult);
  }));

  it('#moveCursorLeft should swap cursor with character to the left in textBody if possible',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['|Hello!'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['H|ello!'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.moveCursorLeft();
      const firstSwap = instance.text.textBody;
      expect(firstSwap).toEqual(expectedResult);
      instance.moveCursorLeft();
      const secondSwap = instance.text.textBody;
      expect(secondSwap).toEqual(expectedResult);
  }));

  it('#moveCursorUp should swap cursor with character above in textBody if possible (larger line above scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['|Hello!', ''];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello!', '|'];
      instance.text.lines = instance.text.textBody.length;
      instance.currentLine = 1;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.moveCursorUp();
      const firstSwap = instance.text.textBody;
      expect(firstSwap).toEqual(expectedResult);
      instance.moveCursorUp();
      const secondSwap = instance.text.textBody;
      expect(secondSwap).toEqual(expectedResult);
  }));

  it('#moveCursorUp should swap cursor with character above in textBody if possible (smaller line above scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['This|', 'is a test'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['This', 'is a test|'];
      instance.text.lines = instance.text.textBody.length;
      instance.currentLine = 1;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.moveCursorUp();
      const firstSwap = instance.text.textBody;
      expect(firstSwap).toEqual(expectedResult);
      instance.moveCursorUp();
      const secondSwap = instance.text.textBody;
      expect(secondSwap).toEqual(expectedResult);
  }));

  it('#moveCursorDown should swap cursor with character below in textBody if possible (larger line above scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello!', '|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['He|llo!', ''];
      instance.text.lines = instance.text.textBody.length;
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.moveCursorDown();
      const firstSwap = instance.text.textBody;
      expect(firstSwap).toEqual(expectedResult);
      instance.moveCursorDown();
      const secondSwap = instance.text.textBody;
      expect(secondSwap).toEqual(expectedResult);
  }));

  it('#moveCursorDown should swap cursor with character below in textBody if possible (smaller line above scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['This', '|is a test'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['|This', 'is a test'];
      instance.text.lines = instance.text.textBody.length;
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.moveCursorDown();
      const firstSwap = instance.text.textBody;
      expect(firstSwap).toEqual(expectedResult);
      instance.moveCursorDown();
      const secondSwap = instance.text.textBody;
      expect(secondSwap).toEqual(expectedResult);
  }));

  it('#addLetter should add a printable character after the cursor in textBody',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello!|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello|'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      const MOCK_LETTER = new KeyboardEvent('keydown', {key: '!'});
      instance.addLetter(MOCK_LETTER);
      const result = instance.text.textBody;
      expect(result).toEqual(expectedResult);
  }));

  it('#removeLetter should remove letter before cursor when backspace is pressed (non-empty line scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello!|'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.removeLetter(BACKSPACE_RELATIVE_POSITION);
      const result = instance.text.textBody;
      expect(result).toEqual(expectedResult);
  }));

  it('#removeLetter should remove letter after cursor when delete is pressed (non-empty line scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello|!'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.removeLetter(DELETE_RELATIVE_POSITION);
      const result = instance.text.textBody;
      expect(result).toEqual(expectedResult);
  }));

  it('#removeLetter should remove empty line when backspace is pressed (empty line scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello!|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello!', '|'];
      instance.currentLine = 1;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.removeLetter(BACKSPACE_RELATIVE_POSITION);
      const result = instance.text.textBody;
      expect(result).toEqual(expectedResult);
  }));

  it('#addLineBelow should add an empty line when enter is pressed (end of line scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hello!', '|'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hello!|'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.addLineBelow();
      const result = instance.text.textBody;
      expect(result).toEqual(expectedResult);
  }));

  it('#addLineBelow should split current line into 2 lines when enter is pressed (middle of line scenario)',
    inject([ColorsService, ToolPropertiesService], (colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      const expectedResult = ['Hel', '|lo!'];
      instance.text = new Text(colorsService, toolProperties);
      instance.text.textBody = ['Hel|lo!'];
      instance.currentLine = 0;
      instance.currentChar = instance.text.textBody[instance.currentLine].indexOf('|');
      instance.cursor = new Cursor();
      instance.addLineBelow();
      const result = instance.text.textBody;
      expect(result).toEqual(expectedResult);
  }));
});
