import { TestBed } from '@angular/core/testing';

import { ApiInteractionService } from './api-interaction.service';

describe('ApiInteractionService', () => {
  let service: ApiInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
