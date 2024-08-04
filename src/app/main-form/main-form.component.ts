import {
  Component,
  ChangeDetectionStrategy,
  signal,
  LOCALE_ID,
  inject,
} from '@angular/core';
import localeDe from '@angular/common/locales/de';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { registerLocaleData } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { emailMismatchValidator } from './validators/emailMismatchValidator';
import { DialogComponent } from '../dialog/dialog.component';

import { DataHandlerService } from '../service/data-handler.service';

registerLocaleData(localeDe);

@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatStepperModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    DialogComponent,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.css',
})
export class MainFormComponent {
  readonly dialog = inject(MatDialog);

  constructor(private dataService: DataHandlerService) {}

  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: title, message: message },
    });
  }

  errorMessage = signal('');

  firstForm = new FormGroup(
    {
      address: new FormControl(''),
      title: new FormControl(''),
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      street: new FormControl(''),
      number: new FormControl(''),
      zipcode: new FormControl(''),
      city: new FormControl(''),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      confirmEmail: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email,
          emailMismatchValidator,
        ],
      }),
      born: new FormControl(''),
      areaCode: new FormControl(
        ''
        // , [
        // Validators.required,
        // Validators.pattern('^[0-9]*$'),
        // Validators.maxLength(4),
        // ]
      ),
      phoneNumber: new FormControl(
        ''
        // , [
        // Validators.required,
        // Validators.pattern('^[0-9]*$'),
        // Validators.maxLength(8),
        // ]
      ),
    },
    { validators: emailMismatchValidator }
  );

  secondForm = new FormGroup({
    acceptedFirst: new FormControl('', { validators: [Validators.required] }),
    acceptedSecond: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  get emailIsInvalid() {
    return (
      this.firstForm.controls.email.touched &&
      this.firstForm.controls.email.invalid &&
      !this.firstForm.controls.email.dirty
    );
  }

  get confirmEmailIsInvalid() {
    return (
      this.firstForm.controls.confirmEmail.touched &&
      this.firstForm.controls.confirmEmail.invalid &&
      !this.firstForm.controls.confirmEmail.dirty
    );
  }

  get confirmedEmailNotIdentical() {
    return this.firstForm.errors?.['emailMatchError'];
  }

  get emailValue() {
    return this.firstForm.controls.email?.value;
  }

  get email() {
    return this.firstForm.get('email');
  }

  get confirmEmail() {
    return this.firstForm.get('confirmEmail');
  }

  get emailMismatch() {
    return (
      this.firstForm.errors?.['emailMismatch'] && this.confirmEmail?.touched
    );
  }

  updateErrorMessage() {
    const confirmEmail = this.firstForm.controls.confirmEmail;
    const mismatch =
      this.firstForm.errors?.['emailMismatch'] && this.confirmEmail?.touched;
    if (
      confirmEmail?.invalid &&
      (confirmEmail?.dirty ||
        (confirmEmail?.touched && confirmEmail?.errors?.['required']))
    ) {
      this.errorMessage.set('Ungültige Email-Adresse');
    } else if (
      (confirmEmail?.invalid &&
        (confirmEmail?.dirty || confirmEmail?.touched)) ||
      (this.firstForm.errors?.['emailMismatch'] && this.confirmEmail?.touched)
    ) {
      this.errorMessage.set('E-Mailadressen stimmen nicht überein.');
    } else if (this.firstForm.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else if (this.firstForm.hasError('emailMatchError')) {
      this.errorMessage.set('E-Mailadressen stimmen nicht überein.');
    } else {
      this.errorMessage.set('');
    }
  }

  moveToNextField(event: any, nextInput: HTMLInputElement) {
    if (event.target.value.length >= event.target.maxLength) {
      nextInput.focus();
    }
  }

  show() {
    const email = this.firstForm.controls.email.value;
    const confirmEmail = this.firstForm.controls.confirmEmail.value;
    const mismatch = this.firstForm?.hasError('emailMismatch');
    if (mismatch && !this.firstForm.controls.confirmEmail?.errors?.['email']) {
      this.errorMessage.set('E-Mailadressen stimmen nicht überein');
    }
    console.log(
      this.firstForm,
      email,
      confirmEmail,
      'mismatch: ' + mismatch,
      this.errorMessage(),
      this.confirmedEmailNotIdentical
    );
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maxLength = 5;

    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
    this.firstForm.get('zipcode')?.setValue(input.value, { emitEvent: false });
  }

  onSubmit() {
    console.log(
      this.firstForm,
      this.firstForm.controls.email.get('email')?.value
    );
  }

  submit() {
    const formData = {
      ...this.firstForm.value,
      ...this.secondForm.value,
    };

    this.dataService.submitFormData(formData).subscribe(
      (response) => {
        // Success-Logik
      },
      (error) => {
        // Error-Logik
      }
    );
  }
}
