// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { Router } from '@angular/router';
import { UserService } from '../../services/user.services';
import { Location } from '@angular/common';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class RegisterComponent {
  personalForm: FormGroup;
  complexForm: FormGroup;
  courts: FormArray;
  currentUser: any = null;
  mode: 'register' | 'edit' = 'register';

  constructor(private location: Location, private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.personalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.complexForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.courts = this.fb.array([this.createCourt()]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.mode = 'edit';
      this.populateForms(); // Cargar los forms con currentUser
    }
  }

  populateForms() {
    // Personal
    this.personalForm.patchValue({
      name: this.currentUser.name,
      email: this.currentUser.email,
      password: '',  // Opcional: solo si quieres que cambie
      phone: this.currentUser.phone
    });

    // Complejo
    this.complexForm.patchValue(this.currentUser.complex);

    // Canchas
    this.courts.clear();
    this.currentUser.courts.forEach((court: any) => {
      this.courts.push(this.fb.group({
        name: [court.name],
        sport: [court.sport],
        type: [court.type],
        price: [court.price]
      }));
    });
  }

  createCourt(): FormGroup {
    return this.fb.group({
      name: [''],
      sport: [''],
      type: [''],
      price: ['']
    });
  }

  addCourt() {
    this.courts.push(this.createCourt());
  }

  removeCourt(index: number) {
    this.courts.removeAt(index);
  }

  get courtsControls(): FormGroup[] {
    return this.courts.controls as FormGroup[];
  }

  submit() {
    const data = {
      personal: this.personalForm.value,
      complex: this.complexForm.value,
      courts: this.courts.value
    };
    console.log('Formulario enviado:', data);
    // Podés enviar esto al backend con un servicio HTTP
  }

  goBack() {
    this.location.back();
  }

}
