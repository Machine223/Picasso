import { TestBed } from '@angular/core/testing';
import { TextToolService } from '../tools/text-tool/text-tool.service';

describe('TextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextToolService = TestBed.get(TextToolService);
    expect(service).toBeTruthy();
  });
});
