import { BehaviorSubject } from 'rxjs';
import { GuideInformationService } from '../app/services/guide-information/guide-information.service';
import { Subject } from '../class/subject';
import { categoriesArray } from '../constants/category-data';

export class MockGuideInformationService extends GuideInformationService {

  constructor() {
    super();
    this.currentCategoryIndex = 0;
    this.currentSubjectIndex = 0;
    this.categories = categoriesArray;
    this.subjectSource = new BehaviorSubject<Subject>(this.categories[1].subjects[2]);
    this.selectedSubjectObservable = this.subjectSource.asObservable();
  }
  onSelect(subject: Subject): void {
    super.onSelect(subject);
  }
}
