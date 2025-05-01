// Angular core
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// Angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

// Servicios
import { UserService } from './../../services/user.services';

// Componentes
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { WeekSchedulerDialogComponent } from '../week-scheduler-dialog/week-scheduler-dialog.component';


@Component({
  selector: 'app-complex-schedule',
  templateUrl: './complex-schedule.component.html',
  styleUrls: ['./complex-schedule.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComplexScheduleComponent implements OnInit {
  complex = {
    name: 'Complejo Ejemplo',
    address: 'Calle Falsa 123',
    city: 'Ciudad',
    province: 'Provincia',
  };

  sports = ['Fútbol', 'Pádel'];
  allCourts = [
    { name: 'Cancha 1', sport: 'Fútbol' },
    { name: 'Cancha 2', sport: 'Pádel' }
  ];

  filteredCourts: { name: string; sport: string }[] = [];
  selectedSport = 'Fútbol';
  selectedCourt: any;

  week: {
    name: string;
    slots: {
      startTime: string;
      endTime: string;
      available: boolean;
    }[];
  }[] = [];

  currentUser: null | any = null;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.filterCourts();
    this.selectedCourt = this.filteredCourts[0];
    this.generateWeekSchedule();
  }

  filterCourts() {
    this.filteredCourts = this.allCourts.filter(c => c.sport === this.selectedSport);
    if (!this.filteredCourts.includes(this.selectedCourt)) {
      this.selectedCourt = this.filteredCourts[0];
    }
  }

  generateWeekSchedule() {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const defaultRanges = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
    ];

    this.week = days.map((day) => {
      let ranges = [...defaultRanges];
      if (day === 'Domingo') {
        ranges = [defaultRanges[1]]; // Solo 10:00 - 11:00
      }

      return {
        name: day,
        slots: ranges.map(range => ({
          startTime: range.start,
          endTime: range.end,
          available: Math.random() > 0.3 // Simula disponibilidad
        }))
      };
    });
  }

  openBookingDialog(slot: any) {
    this.dialog.open(BookingDialogComponent, {
      data: {
        court: this.selectedCourt,
        complex: this.complex,
        slot: slot.startTime + ' - ' + slot.endTime,
      }
    });
  }

  toggleSlot(dayName: string, slot: any) {
    if (!this.currentUser) return;

    const day = this.week.find(d => d.name === dayName);
    if (!day) return;

    const targetSlot = day.slots.find(s =>
      s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    if (targetSlot) {
      targetSlot.available = !targetSlot.available;
      // Podés actualizar al backend desde acá
      // this.scheduleService.updateSlotAvailability(...)
    }
  }

  openScheduleDialog() {
    const dialogRef = this.dialog.open(WeekSchedulerDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos de la organización de semana:', result);
        // Enviar a backend para generar slots
      }
    });
  }

  enableAllSlots() {
    this.week.forEach(day => {
      day.slots.forEach(slot => {
        slot.available = true;
      });
    });

    // Opcional: acá podrías enviar al backend para guardar cambios
    // this.scheduleService.updateAllSlotsAvailability(...)
  }

  goEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  goBack() {
    this.userService.clearUser();
    this.location.back();
  }
}
