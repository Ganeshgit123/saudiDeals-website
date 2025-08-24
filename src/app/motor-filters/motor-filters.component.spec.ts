import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorFiltersComponent } from './motor-filters.component';

describe('MotorFiltersComponent', () => {
  let component: MotorFiltersComponent;
  let fixture: ComponentFixture<MotorFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
