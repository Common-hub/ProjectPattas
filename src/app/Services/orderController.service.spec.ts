import { TestBed } from '@angular/core/testing';

import { OrderController } from './order-handler.service';

describe('OrderHandlerService', () => {
  let service: OrderController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
