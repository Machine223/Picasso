import { Injectable } from '@angular/core';
import { AddSVGElement } from '@app-services/undo-redo/add-svgelement';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawingElementsService {
  cursorElement: ReplaySubject<SVGElement>;
  selectorRenderer: ReplaySubject<SVGElement>;
  temporaryRenderer: ReplaySubject<SVGElement>;
  completedRenderer: ReplaySubject<SVGElement>;
  elementToDelete: ReplaySubject<SVGElement>;

  constructor(private undoRedoManager: UndoRedoManagerService) {
    this.selectorRenderer = new ReplaySubject<SVGElement>(1);
    this.temporaryRenderer = new ReplaySubject<SVGElement>(1);
    this.completedRenderer = new ReplaySubject<SVGElement>(1);
    this.elementToDelete = new ReplaySubject<SVGElement>(1);
    this.cursorElement = new ReplaySubject<SVGElement>(1);
  }

  addCompletedSVGToDrawing(drawingElement: SVGElement): void {
    const addCommand = new AddSVGElement(drawingElement, this);
    this.undoRedoManager.executeCommand(addCommand);
  }
}
