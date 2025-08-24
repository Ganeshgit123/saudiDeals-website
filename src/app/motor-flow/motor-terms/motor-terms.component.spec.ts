import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorTermsComponent } from './motor-terms.component';

describe('MotorTermsComponent', () => {
  let component: MotorTermsComponent;
  let fixture: ComponentFixture<MotorTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorTermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
