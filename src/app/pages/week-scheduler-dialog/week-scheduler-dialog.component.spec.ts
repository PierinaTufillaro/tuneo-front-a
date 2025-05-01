import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekSchedulerDialogComponent } from './week-scheduler-dialog.component';

describe('WeekSchedulerDialogComponent', () => {
  let component: WeekSchedulerDialogComponent;
  let fixture: ComponentFixture<WeekSchedulerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekSchedulerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekSchedulerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
