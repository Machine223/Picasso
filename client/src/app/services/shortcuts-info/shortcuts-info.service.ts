import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsInfoService {

  openedDialogSubject: BehaviorSubject<boolean>;

  constructor() {
    this.openedDialogSubject = new BehaviorSubject<boolean>(false);
  }

  openedDialogChange(isOpenedInput: boolean): void {
    this.openedDialogSubject.next(isOpenedInput);
  }
}
