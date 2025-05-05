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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CourtService } from '../../services/court.service';
import { ComplexService } from '../../services/complex.service';
import { from, mergeMap, switchMap } from 'rxjs';
import { Court } from '../../interfaces/court.model';

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
    CommonModule,
  ],
})
export class RegisterComponent {
  personalForm: FormGroup;
  complexForm: FormGroup;
  courts: FormArray;
  currentUser: any = null;
  mode: 'register' | 'edit' = 'register';

  constructor(
    private courtService: CourtService,
    private complexService: ComplexService,
    private userService: UserService,
    private location: Location,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.personalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.complexForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.courts = this.fb.array([this.createCourt()]);
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.mode = 'edit';
      this.populateForms();
    }
  }

  populateForms() {
    this.personalForm.patchValue({
      name: this.currentUser.name,
      email: this.currentUser.email,
      password: this.currentUser.password,
      phone: this.currentUser.phone,
    });

    this.complexForm.patchValue(this.currentUser.complex);

    this.courts.clear();
    this.currentUser.courts?.forEach((court: any) => {
      this.courts.push(
        this.fb.group({
          name: [court.name],
          sport: [court.sport],
          type: [court.type],
          hourly_price: [court.hourly_price],
        })
      );
    });
  }

  createCourt(): FormGroup {
    return this.fb.group({
      name: [''],
      sport: [''],
      type: [''],
      hourly_price: [''],
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
      user: this.personalForm.value,
      complex: this.complexForm.value,
      courts: this.courts.value,
    };
    if (this.mode == 'register') {
      this.userService
        .createUser(data.user)
        .pipe(
          switchMap((userRes) => {
            console.log('User created:', userRes);
            data.complex.user_id = userRes.id;
            return this.complexService.createComplex(data.complex);
          }),
          switchMap((complexRes) => {
            const fieldRequests = data.courts.map((court: Court) => ({
              ...court,
              complex_id: complexRes.id,
            }));

            return from(fieldRequests as Court[]).pipe(
              mergeMap((court: Court) => this.courtService.createCourt(court))
            );
          })
        )
        .subscribe({
          next: (finalResponse) => {
            console.log('Register completed:', finalResponse);
          },
          error: (err) => {
            console.error('Error in register:', err);
          },
        });
    } else {
      // TODO
      this.userService
        .updateUser(this.currentUser.id, data.user)
        .subscribe((response) => {
          console.log('User Updated:', response);
          this.authService.setCurrentUser(response);
        });
    }
    console.log('Form sent:', data);
  }

  goBack() {
    this.location.back();
  }
}
