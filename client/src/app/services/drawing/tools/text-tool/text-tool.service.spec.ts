import { RendererFactory2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Text } from '@app-services/drawing/text/text';
import { TextElementCreator } from 'class/svg-elements-creators/text-element-creator';
import { ToolPropertiesService } from '../tool-properties.service';
import { TextToolService } from './text-tool.service';

describe('TextToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  let service: TextToolService;

  beforeEach(() => {
    service = TestBed.get(TextToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#keyboardMapCreator should call addLineBelow if event\'s key is Enter',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_ENTER = new KeyboardEvent('keydown', {key: 'Enter'});
      const spy = spyOn(service.textCreator, 'addLineBelow');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_ENTER);
      expect(spy).toHaveBeenCalled();
  }));

  it('#keyboardMapCreator should call removeLetter with a param. of -1 if event\'s key is Backspace',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_BACKSPACE = new KeyboardEvent('keydown', {key: 'Backspace'});
      const spy = spyOn(service.textCreator, 'removeLetter');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_BACKSPACE);
      expect(spy).toHaveBeenCalledWith(-1);
  }));

  it('#keyboardMapCreator should call removeLetter with a param. of 1 if event\'s key is Delete',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_DELETE = new KeyboardEvent('keydown', {key: 'Delete'});
      const spy = spyOn(service.textCreator, 'removeLetter');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_DELETE);
      expect(spy).toHaveBeenCalledWith(1);
  }));

  it('#keyboardMapCreator should call abortEdition if event\'s key is Escape',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_ESCAPE = new KeyboardEvent('keydown', {key: 'Escape'});
      const spy = spyOn(service, 'abortEdition');
      service.keyboardEventDispatcher(MOCK_ESCAPE);
      expect(spy).toHaveBeenCalled();
  }));

  it('#keyboardMapCreator should call moveCursorLeft if event\'s key is ArrowLeft',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_ARROW = new KeyboardEvent('keydown', {key: 'ArrowLeft'});
      const spy = spyOn(service.textCreator, 'moveCursorLeft');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_ARROW);
      expect(spy).toHaveBeenCalled();
  }));

  it('#keyboardMapCreator should call moveCursorLeft if event\'s key is ArrowRight',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_ARROW = new KeyboardEvent('keydown', {key: 'ArrowRight'});
      const spy = spyOn(service.textCreator, 'moveCursorRight');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_ARROW);
      expect(spy).toHaveBeenCalled();
  }));

  it('#keyboardMapCreator should call moveCursorLeft if event\'s key is ArrowUp',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_ARROW = new KeyboardEvent('keydown', {key: 'ArrowUp'});
      const spy = spyOn(service.textCreator, 'moveCursorUp');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_ARROW);
      expect(spy).toHaveBeenCalled();
  }));

  it('#keyboardMapCreator should call moveCursorLeft if event\'s key is ArrowDown',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_ARROW = new KeyboardEvent('keydown', {key: 'ArrowDown'});
      const spy = spyOn(service.textCreator, 'moveCursorDown');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_ARROW);
      expect(spy).toHaveBeenCalled();
  }));

  it('#onMouseDown should create a cursor',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      const MOCK_CLICK = new MouseEvent('onclick');
      service.onMouseDown(MOCK_CLICK);
      const textBody = service.textCreator.text.textBody;
      expect(textBody).toEqual(['|']);
  }));

  it('#keyboardEventDispatcher should call addLetter if event\'s key is a printable character',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      service.isWriting = true;
      const MOCK_PRINTABLE = new KeyboardEvent('keydown', {key: 'A'});
      const printableSpy = spyOn(service.textCreator, 'addLetter');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_PRINTABLE);
      expect(printableSpy).toHaveBeenCalled();
  }));

  it('#keyboardEventDispatcher should call addLetter if event\'s key is a not printable character',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      service.isWriting = true;
      const MOCK_UNPRINTABLE = new KeyboardEvent('keydown', {key: 'Tab'});
      const spy = spyOn(service.textCreator, 'addLetter');
      spyOn(service, 'updateText').and.returnValue();
      service.keyboardEventDispatcher(MOCK_UNPRINTABLE);
      expect(spy).not.toHaveBeenCalled();
  }));

  it('#eventTypeDispatcher should call onMouseDown if event\'s is mousedown',
  inject([RendererFactory2, ColorsService, ToolPropertiesService],
  (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
    service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
    const MOCK_CLICK = new MouseEvent('mousedown');
    const spy = spyOn(service, 'onMouseDown');
    service.eventTypeDispatcher(MOCK_CLICK);
    expect(spy).toHaveBeenCalled();
  }));

  it('#eventTypeDispatcher should not call onMouseDown if event\'s is not mousedown',
  inject([RendererFactory2, ColorsService, ToolPropertiesService],
  (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
    service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
    const MOCK_CLICK = new MouseEvent('mouseup');
    const spy = spyOn(service, 'onMouseDown');
    service.eventTypeDispatcher(MOCK_CLICK);
    expect(spy).not.toHaveBeenCalled();
  }));

  it('#onMouseDown should call finalizeText if click was outside of textbox',
  inject([RendererFactory2, ColorsService, ToolPropertiesService],
  (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
    service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
    service.isWriting = true;
    spyOn(service.textCreator, 'isMouseInTextbox').and.returnValue(false);
    const MOCK_CLICK = new MouseEvent('mousedown');
    const spy = spyOn(service, 'finalizeText').and.returnValue();
    service.onMouseDown(MOCK_CLICK);
    expect(spy).toHaveBeenCalled();
  }));

  it('#abortEdition should clear the current text if Escape is pressed',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      service.isWriting = true;
      const emptyCreationSpy = spyOn(service, 'createNewText');
      const MOCK_ESCAPE = new KeyboardEvent('keydown', {key: 'Escape'});
      service.keyboardEventDispatcher(MOCK_ESCAPE);
      const updatedIsWriting = service.isWriting;
      const updatedTextBody = service.textProperties.textBody;
      expect(updatedIsWriting).toBe(false);
      expect(updatedTextBody).toBeUndefined();
      expect(emptyCreationSpy).toHaveBeenCalled();
  }));

  it('#updateText should update temporaryRenderer when a printable character is pressed',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textProperties = new Text(colorsService, toolProperties);
      service.textProperties.textBody = ['Hello|'];
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      service.textCreator.text = new Text(colorsService, toolProperties);
      service.textCreator.text.textBody = service.textProperties.textBody;
      service.textCreator.currentLine = 0;
      service.textCreator.currentChar = service.textCreator.text.textBody[service.textCreator.currentLine].indexOf('|');
      const MOCK_PRINTABLE = new KeyboardEvent('keydown', {key: '!'});
      service.isWriting = true;
      const spy = spyOn(service.drawingElements.temporaryRenderer, 'next').and.returnValue();
      service.keyboardEventDispatcher(MOCK_PRINTABLE);
      expect(spy).toHaveBeenCalled();
  }));

  it('#finalizeText should add the final element to drawingElements',
    inject([RendererFactory2, ColorsService, ToolPropertiesService],
    (renderer: RendererFactory2, colorsService: ColorsService, toolProperties: ToolPropertiesService) => {
      service.textProperties = new Text(colorsService, toolProperties);
      service.textProperties.textBody = ['Hello|'];
      service.textCreator = new TextElementCreator(renderer, colorsService, toolProperties);
      service.textCreator.text = new Text(colorsService, toolProperties);
      service.textCreator.text.textBody = service.textProperties.textBody;
      service.textCreator.currentLine = 0;
      service.textCreator.currentChar = service.textCreator.text.textBody[service.textCreator.currentLine].indexOf('|');
      const spy = spyOn(service.drawingElements, 'addCompletedSVGToDrawing').and.returnValue();
      service.finalizeText();
      expect(spy).toHaveBeenCalled();
  }));
});
