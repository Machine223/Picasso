import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
  providedIn: 'root'
})
export class SavedDrawingsService {

  savedDrawingsSubject: Subject<Drawing[]>;

  constructor() {
    this.savedDrawingsSubject = new Subject<Drawing[]>();
  }

  updateSavedDrawings(newSavedDrawings: Drawing[]): void {
    this.savedDrawingsSubject.next(newSavedDrawings);
  }
}
