import { TestBed } from '@angular/core/testing';

import { EraseSVGElement } from './erase-svgelement';
import { UndoRedoManagerService } from './undo-redo-manager.service';

describe('UndoRedoManagerService', () => {
  let service: UndoRedoManagerService;
  beforeEach(() => {
  TestBed.configureTestingModule({
    providers: []
  });
  service = TestBed.get(UndoRedoManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#executeCommand should add the command to the executedCommands table', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect');
    const drawing = document.createElementNS(svgNS, 'svg') as SVGSVGElement;
    const commandToAdd = new EraseSVGElement([rectangle], drawing);
    service.executeCommand(commandToAdd);
    const result = service.executedCommands.indexOf(commandToAdd);
    expect(result).toEqual(0);
  });

  it('#undo should add the command to the undoneCommands table when there is a command in executedCommands', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect');
    const drawing = document.createElementNS(svgNS, 'svg') as SVGSVGElement;
    const commandToAdd = new EraseSVGElement([rectangle], drawing);
    service.executeCommand(commandToAdd);
    service.undo();
    const result = service.undoneCommands.indexOf(commandToAdd);
    expect(result).toEqual(0);
  });

  it('#undo should not add the command to the undoneCommands table when there is no command in executedCommands', () => {
    service.undo();
    const result = service.undoneCommands.length;
    expect(result).toEqual(0);
  });

  it('#redo should add the command to the executedCommands table when there is a command in undoneCommands', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect');
    const drawing = document.createElementNS(svgNS, 'svg') as SVGSVGElement;
    const commandToAdd = new EraseSVGElement([rectangle], drawing);
    service.undoneCommands.push(commandToAdd);
    service.redo();
    const result = service.executedCommands.indexOf(commandToAdd);
    expect(result).toEqual(0);
  });

  it('#redo should not add the command to the executedCommands table when there is no command in undoneCommands', () => {
    service.redo();
    const result = service.executedCommands.length;
    expect(result).toEqual(0);
  });

  it('#clearCommands should reset executedCommand and undoneCommands to zero element', () => {
    const svg   = document.documentElement;
    const svgNS = svg.namespaceURI;
    const rectangle = document.createElementNS(svgNS, 'rect');
    const drawing = document.createElementNS(svgNS, 'svg') as SVGSVGElement;
    const commandToAdd = new EraseSVGElement([rectangle], drawing);
    service.undoneCommands.push(commandToAdd);
    service.executedCommands.push(commandToAdd);
    service.clearCommands();
    const result1 = service.executedCommands.length;
    const result2 = service.executedCommands.length;
    expect(result1).toEqual(0);
    expect(result2).toEqual(0);
  });

});
