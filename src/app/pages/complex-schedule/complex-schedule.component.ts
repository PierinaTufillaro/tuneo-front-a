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
import { AuthService } from '../../services/auth.service';
import { ComplexService } from '../../services/complex.service';
import { CourtService } from '../../services/court.service';
import { BookingService } from '../../services/booking.service';

// Componentes
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { WeekSchedulerDialogComponent } from '../week-scheduler-dialog/week-scheduler-dialog.component';

// Interfaces
import { Complex } from '../../interfaces/complex.model';
import { Booking } from '../../interfaces/booking.model';

@Component({
  selector: 'app-complex-schedule',
  templateUrl: './complex-schedule.component.html',
  styleUrls: ['./complex-schedule.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComplexScheduleComponent implements OnInit {
  // Propiedades
  complex: Complex | null = null;
  allCourts: { name: string; sport: string }[] = [];
  sports: string[] = [];
  filteredCourts: { name: string; sport: string }[] = [];
  selectedSport = '';
  selectedCourt: any;
  bookingSlots: any[] = []; // Aquí almacenaremos los turnos obtenidos
  week: {
    name: string;
    slots: { startTime: string; endTime: string; status: string }[];
  }[] = [];
  currentUser: null | any = null;

  // Constructor
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private complexService: ComplexService,
    private courtService: CourtService,
    private bookingService: BookingService,
    private router: Router,
    private location: Location
  ) {}

  // ngOnInit
  ngOnInit() {
    this.initializeUser();
    this.loadComplexAndCourts();
  }

  // Métodos

  // 1. Inicializar el usuario
  private initializeUser() {
    this.currentUser = this.authService.getCurrentUser();
  }

  // 2. Cargar el complejo y las canchas
  private loadComplexAndCourts() {
    this.complexService.getMyComplexes().subscribe(
      (complexes) => {
        if (complexes && complexes.length > 0) {
          this.complex = complexes[0];
          this.fetchCourts();
        } else {
          console.error('No complexes found.');
        }
      },
      (error) => {
        console.error('Error fetching complexes:', error);
      }
    );
  }

  // 3. Obtener las canchas del complejo
  private fetchCourts() {
    if (this.complex?.id !== undefined) {
      this.complexService.getCourtsOfComplex(this.complex.id).subscribe(
        (courts) => {
          this.allCourts = courts;
          this.updateSports();
        },
        (error) => {
          console.error('Error fetching courts:', error);
        }
      );
    } else {
      console.error('Complex ID is undefined. Cannot fetch courts.');
    }
  }

  // 4. Actualizar lista de deportes
  private updateSports() {
    this.sports = Array.from(new Set(this.allCourts.map((court) => court.sport)));
    this.selectedSport = this.sports[0] || '';
    this.filterCourts();
  }

  // 5. Filtrar las canchas según el deporte seleccionado
  filterCourts() {
    this.filteredCourts = this.allCourts.filter(
      (court) => court.sport === this.selectedSport
    );
    this.selectedCourt = this.filteredCourts[0] || null;
    if (this.selectedCourt) {
      this.getSlotsByCourt(this.selectedCourt.id);
    }
  }

  private getSlotsByCourt(courtId: number) {
    this.bookingService.getSlotsByCourt(courtId).subscribe(
      (slots) => {
        this.generateWeekScheduleFromBackend(slots); // inicializa la semana vacía
        this.bookingSlots = slots;
        this.updateWeekWithSlots();
        console.log('Booking slots:', this.bookingSlots);
      },
      (error) => {
        console.error('Error fetching booking slots:', error);
      }
    );
  }

  private updateWeekWithSlots() {
    this.bookingSlots.forEach((slot) => {
      const day = this.week.find((d) => d.name === slot.weekday);
      if (day) {
        day.slots.push({
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.status  // usar directamente el valor que da el backend
        });
      }
    });
  }

  // 6. Generar la programación semanal
  generateWeekScheduleFromBackend(slots: Booking[]) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Estructura vacía de la semana
    const weekMap: { [key: string]: any[] } = {};
    dayNames.forEach(name => weekMap[name] = []);

    // Agrupar slots por día
    slots.forEach(slot => {
      const dayIndex = parseInt(slot.weekday); // Asegurate que sea 0 a 6
      const dayName = dayNames[dayIndex];
      if (weekMap[dayName]) {
        weekMap[dayName].push({
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.status
        });
      }
    });

    // Ordenar cada lista de slots por hora
    for (const dayName in weekMap) {
      weekMap[dayName].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    // Convertir a array final
    this.week = dayNames.map(name => ({
      name,
      slots: weekMap[name],
    }));
  }

  // 7. Abrir el cuadro de diálogo de reservas
  openBookingDialog(slot: any) {
    this.dialog.open(BookingDialogComponent, {
      data: {
        court: this.selectedCourt,
        complex: this.complex,
        slot: slot.startTime + ' - ' + slot.endTime,
      },
    });
  }

  // 8. Alternar la disponibilidad de un slot
  toggleSlot(dayName: string, slot: any) {
    if (!this.currentUser) return;

    const day = this.week.find((d) => d.name === dayName);
    if (!day) return;

    const targetSlot = day.slots.find(
      (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    if (targetSlot) {
      if (targetSlot.status === 'booked') {
        targetSlot.status = 'available';
      } else {
        targetSlot.status = 'booked';
      }
    } else {
      console.error('Target slot not found.');
    }
  }

  // 9. Abrir el cuadro de diálogo para la programación semanal
  openScheduleDialog() {
    const dialogRef = this.dialog.open(WeekSchedulerDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos de la organización de semana:', result);
      }
    });
  }

  // 10. Habilitar todos los slots
  enableAllSlots() {
    this.week.forEach((day) => {
      day.slots.forEach((slot) => {
        slot.status = 'available';
      });
    });
  }

  // 11. Navegar a la edición del perfil
  goEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  // 12. Volver atrás
  goBack() {
    this.authService.clearUser();
    this.location.back();
  }
}
