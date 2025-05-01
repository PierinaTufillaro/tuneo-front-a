import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-dialog',
  imports: [MatDialogModule],
  styleUrls: ['./booking-dialog.component.scss'],
  templateUrl: './booking-dialog.component.html',
})
export class BookingDialogComponent {
  whatsappLink: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BookingDialogComponent>
  ) {
    const message = encodeURIComponent(
      `Hola! Quiero reservar la ${data.court.name} el ${data.slot.time} en el ${data.complex.name}.`
    );
    this.whatsappLink = `https://wa.me/1234567890?text=${message}`;
  }
}
