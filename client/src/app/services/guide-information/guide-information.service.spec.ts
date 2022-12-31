import { TestBed } from '@angular/core/testing';
import { categoriesArray } from '../../../constants/category-data';
import { MockGuideInformationService } from '../../../mock/mock-user-guide.service';
import { GuideInformationService } from './guide-information.service';

let service: MockGuideInformationService;
beforeAll(() => {
 service = new MockGuideInformationService();
});
describe('GuideInformationService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const s: GuideInformationService = TestBed.get(GuideInformationService);
    expect(s).toBeTruthy();
  });
});
describe( 'GuideInformationService :Testing the navigator button logic', () => {
  it('#navClick() return false when isNavClick is true initially ', () => {
    service.isNavClicked = true;
    expect(service.navClicked()).toBeFalsy();
  });
  it('#navClick() return true when isNavClick is faLse initially', () => {
    service.isNavClicked = false;
    expect(service.navClicked()).toBeTruthy();
  });
});

describe('GuideInformationService: Testing the next() logic', () =>  {
  it('#nextCategory() Should go to the next subject in a category with more than one element if not the last subject', () => {
    service.currentSubjectIndex = 1;
    service.currentCategoryIndex = 1;
    service.nextCategory();
    expect(service.currentSubjectIndex).toBe(2);
    expect(service.currentCategoryIndex).toBe(1);
  });
  it('GuideInformationService: #nextCategory() should go to the next category if the subject is the last of the current category', () => {
    service.currentCategoryIndex = 1;
    const currentCategoryIndexTemp: number = service.currentCategoryIndex;
    service.currentSubjectIndex = service.categories[service.currentCategoryIndex].subjects.length - 1;
    service.nextCategory();
    expect(service.currentSubjectIndex).toBe(0);
    expect(service.currentCategoryIndex).toBe(currentCategoryIndexTemp + 1);
  });
  it('GuideInformationService: #nextCategory() Should stay at the last subject if it is the last category ', () => {
    service.currentCategoryIndex = service.categories.length - 1;
    service.currentSubjectIndex = service.categories[service.currentCategoryIndex].subjects.length - 1;
    const lastCategoryIndex: number = service.currentCategoryIndex;
    const lastSubjectIndex: number = service.currentSubjectIndex;
    service.nextCategory();
    expect(service.currentSubjectIndex).toBe(lastSubjectIndex);
    expect(service.currentCategoryIndex).toBe(lastCategoryIndex);
  });
});

describe('GuideInformationService: Testing the prev() logic', () =>  {
  it('#prevCategory() should go to the previous subject in the same category with more than one element if not the first subject', () => {
    service.currentSubjectIndex = 1;
    service.currentCategoryIndex = 1;
    const subjectIndex = service.currentSubjectIndex;
    const categoryIndex = service.currentCategoryIndex;
    service.prevCategory();
    expect(service.currentSubjectIndex).toBe(subjectIndex - 1);
    expect(service.currentCategoryIndex).toBe(categoryIndex);
  });
  it('#prevCategory() Should go to the previous category if the subject is the first subject of the first category', () => {
    service.currentCategoryIndex = 1;
    const currentCategoryIndexTemp: number = service.currentCategoryIndex;
    service.currentSubjectIndex = 0;
    service.prevCategory();
    expect(service.currentSubjectIndex).toBe(service.categories[service.currentCategoryIndex].subjects.length - 1);
    expect(service.currentCategoryIndex).toBe(currentCategoryIndexTemp - 1);
  });
  it("#prevCategory() should stay on the first subject if it's the first subject of the first category ", () => {
    service.currentCategoryIndex = 0;
    service.currentSubjectIndex = 0;
    const lastCategoryIndex: number = service.currentCategoryIndex;
    const lastSubjectIndex: number = service.currentSubjectIndex;
    service.prevCategory();
    expect(service.currentSubjectIndex).toBe(lastSubjectIndex);
    expect(service.currentCategoryIndex).toBe(lastCategoryIndex);
  });
});

describe('GuideInformationService: Testing the onselect functionality', () => {
  it('#findPosition() should set the good index of currentSubjectIndex', () => {
    service.currentCategoryIndex = 0;
    service.currentSubjectIndex = 0;
    service.subjectSource.next(categoriesArray[1].subjects[2]);
    service.findPosition();
    expect(service.currentSubjectIndex).toBe(2);
  });
  it('#findPosition() should set the good index of currentCategory', () => {
    service.currentCategoryIndex = 0;
    service.currentSubjectIndex = 0;
    service.subjectSource.next(categoriesArray[1].subjects[2]);
    service.findPosition();
    expect(service.currentCategoryIndex).toBe(1);
  });
  it('#onSelect() should set the good indexes to categoryIndex and subjectIndex', () => {
    const subject = categoriesArray[1].subjects[2];
    service.onSelect(subject);
    expect(service.currentSubjectIndex).toBe(2);
  });
  it('#onSelect() should set the good indexes to categoryIndex and subjectIndex', () => {
      const subject = categoriesArray[1].subjects[2];
      service.onSelect(subject);
      expect(service.currentCategoryIndex).toBe(1);
  });
});
