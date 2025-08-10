import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KartItemsComponent } from './kart-items.component';

describe('KartItemsComponent', () => {
  let component: KartItemsComponent;
  let fixture: ComponentFixture<KartItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KartItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
