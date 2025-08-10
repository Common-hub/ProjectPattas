import { TestBed } from '@angular/core/testing';

import { apiInterceptor } from './my-interceptor.interceptor';

describe('MyInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      apiInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: apiInterceptor = TestBed.inject(apiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
