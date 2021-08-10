import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  isLoading = false;

  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private readonly accountService: AccountsService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  register() {
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.isLoading = true;
      this.accountService
        .signup(email, password)
        .subscribe((user) => {
          this.isLoading = false;
          this.snackBar.open(`Usuario registrado exitosamente`, 'Aceptar', { duration: 3500 });
          this.form.reset();
        }, ({ error }) => {
          this.error = error.message || 'Ha ocurrido un error registrando el usuario';
          this.isLoading = false;
        });
    }
  }
  getEmailErrors() {
    if (this.email.hasError('required')) {
      return 'Correo electrónico es requerido';
    }
    return this.email.hasError('email') ? 'Dirección de correo inválida' : '';
  }

  get email() {
    return this.form.get('email');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get password() {
    return this.form.get('password');
  }

  getPasswordErrors() {
    if (this.password.hasError('required')) {
      return 'Contraseña es requerida';
    }
  }
  getPasswordConfirmErrors() {
    if (this.confirmPassword.hasError('required')) {
      return 'Confirmar Contraseña es requerida';
    }
    return this.confirmPassword.hasError('mustMatch') ? 'La confirmación de contraseña debe coincidir con la contraseña' : '';
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
