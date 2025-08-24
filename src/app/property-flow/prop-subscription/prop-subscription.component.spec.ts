import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropSubscriptionComponent } from './prop-subscription.component';

describe('PropSubscriptionComponent', () => {
  let component: PropSubscriptionComponent;
  let fixture: ComponentFixture<PropSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
