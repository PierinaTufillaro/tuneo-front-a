import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexScheduleComponent } from './complex-schedule.component';

describe('ComplexScheduleComponent', () => {
  let component: ComplexScheduleComponent;
  let fixture: ComponentFixture<ComplexScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplexScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplexScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
