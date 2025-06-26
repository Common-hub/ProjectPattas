import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrackersNavigatorComponent } from './crackers-navigator.component';

describe('CrackersNavigatorComponent', () => {
  let component: CrackersNavigatorComponent;
  let fixture: ComponentFixture<CrackersNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrackersNavigatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrackersNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
