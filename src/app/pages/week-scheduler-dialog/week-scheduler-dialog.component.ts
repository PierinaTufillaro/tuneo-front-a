import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-week-scheduler-dialog',
  templateUrl: './week-scheduler-dialog.component.html',
  styleUrls: ['./week-scheduler-dialog.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogContent,
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class WeekSchedulerDialogComponent {
  days = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  schedule: any = {};

  durations = ['30 minutos', '1 hora', '1 hora 30 minutos', '2 horas'];

  constructor(public dialogRef: MatDialogRef<WeekSchedulerDialogComponent>) {
    this.days.forEach(day => {
      this.schedule[day] = {
        from: '',
        to: '',
      };
    });
  }

  save() {
    this.dialogRef.close(this.schedule);
  }

  cancel() {
    this.dialogRef.close();
  }
}
