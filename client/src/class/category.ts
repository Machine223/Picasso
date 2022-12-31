import {Subject} from './subject';

export class Category {
  subjects: Subject[];
  category: string;

  constructor(category: string, subjects: Subject[] ) {
    this.category = category;
    this.subjects = subjects;
  }
}
