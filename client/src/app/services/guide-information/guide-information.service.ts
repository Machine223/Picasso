import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { Category } from '../../../class/category';
import { Subject } from '../../../class/subject';
import { categoriesArray } from '../../../constants/category-data';

@Injectable({
  providedIn: 'root'
})
export class GuideInformationService {

  firstCategory: boolean;
  lastCategory: boolean;
  isNavClicked: boolean;
  currentCategoryIndex: number;
  currentSubjectIndex: number;
  categories: Category[];
  subjectSource: BehaviorSubject<Subject>;
  selectedSubjectObservable: Observable<Subject>;

  constructor() {
    this.categories = categoriesArray;
    this.isNavClicked = false;
    this.currentCategoryIndex = 0;
    this.currentSubjectIndex = 0;
    this.updateFirstAndLast();
    this.subjectSource = new BehaviorSubject<Subject>(this.categories[0].subjects[0]);
    this.selectedSubjectObservable = this.subjectSource.asObservable();
  }

  navClicked(): boolean {
    this.isNavClicked = (!this.isNavClicked);
    return this.isNavClicked;
  }

  onSelect(subject: Subject): void {
    this.subjectSource.next(subject);
    this.findPosition();
    this.updateFirstAndLast();
  }

  findPosition(): void {
    for (let i = 0; i < this.categories.length; i++) {
      for (let j = 0; j < this.categories[i].subjects.length ; j++) {
        if (this.categories[i].subjects[j] === this.subjectSource.getValue()) {
          this.currentCategoryIndex = i;
          this.currentSubjectIndex = j;
        }
      }
    }
  }

  subjectNavClicked(): void {
    if (this.isNavClicked) {
      this.isNavClicked = false;
    }
  }

  nextCategory(): Subject {
    if (this.currentSubjectIndex === this.categories[this.currentCategoryIndex].subjects.length - 1) {
      if (this.currentCategoryIndex !== this.categories.length - 1) {
        this.currentCategoryIndex++;
        this.currentSubjectIndex = 0;
      }
    } else {
        this.currentSubjectIndex++;
      }
    this.subjectSource.next(this.categories[this.currentCategoryIndex].subjects[this.currentSubjectIndex]);
    this.updateFirstAndLast();
    return this.subjectSource.getValue();
  }

  prevCategory(): Subject {
    if (this.currentSubjectIndex === 0) {
      if (this.currentCategoryIndex !== 0) {
        this.currentCategoryIndex--;
        this.currentSubjectIndex = this.categories[this.currentCategoryIndex].subjects.length - 1;
      }
    } else {
      this.currentSubjectIndex--;
    }
    this.subjectSource.next(this.categories[this.currentCategoryIndex].subjects[this.currentSubjectIndex]);
    this.updateFirstAndLast();
    return this.subjectSource.getValue();
  }

  hasImage(): boolean {
    return this.categories[this.currentCategoryIndex].subjects[this.currentSubjectIndex].imageLink !== undefined;
  }

  isFirstCategory(): boolean {
    return (this.currentSubjectIndex === 0 && this.currentCategoryIndex === 0);
  }

  isLastCategory(): boolean {
    return (this.currentCategoryIndex === this.categories.length - 1 &&
      this.categories[this.categories.length - 1].subjects.length - 1 === this.currentSubjectIndex);
  }

  updateFirstAndLast(): void {
    this.firstCategory = this.isFirstCategory();
    this.lastCategory = this.isLastCategory();
  }
}
