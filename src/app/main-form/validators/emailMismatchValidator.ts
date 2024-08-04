import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export const emailMismatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const email = control.get('email');
  const confirmEmail = control.get('confirmEmail');

  return email && confirmEmail && email.value !== confirmEmail.value
    ? { emailMismatch: true }
    : null;
};
