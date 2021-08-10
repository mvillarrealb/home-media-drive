import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessToken } from 'src/app/services/access.token';
import { MustMatch } from 'src/app/auth/signin/signin.component';
import { AccountsService } from 'src/app/services/accounts.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  error: any;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AccountsService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: Observable<AccessToken>,
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([a-z]|[A-Z]|'|á|é|í|ó|ú|ñ|ü|Á|É|Í|Ó|Ú|Ñ|Ü|\s|\'|\-)+$/)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([a-z]|[A-Z]|'|á|é|í|ó|ú|ñ|ü|Á|É|Í|Ó|Ú|Ñ|Ü|\s|\'|\-)+$/)
      ])
    });
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ])
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.data.subscribe(({ payload }) => {
      const { name, lastName } = payload;
      this.userForm.patchValue({ name, lastName });
    });
  }
  changePassword() {
    console.log(this.passwordForm);
    if (this.passwordForm.valid) {
      const { password } = this.passwordForm.getRawValue();
      this.isLoading = true;
      this.authenticationService.changePassword(password)
        .subscribe((account) => {
          this.isLoading = false;
          this.snackBar.open('Contraseña Editada correctamente', 'Cerrar', {
            duration: 3500
          });
        }, ({ message, details }) => {
          this.isLoading = false;
          const messageDetail = message || `Error editando la contraseña`;
          this.snackBar.open(messageDetail, 'Cerrar', {
            duration: 3500
          });
        });
    }
  }
  get name() {
    return this.userForm.get('name');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }
  get password() {
    return this.passwordForm.get('password');
  }
  getNameErrors() {
    if (this.name.hasError('required')) {
      return 'Nombre es requerido';
    }
    return this.name.hasError('pattern') ? 'Nombre tiene valores incorrectos' : '';
  }
  getLastNameErrors() {
    if (this.lastName.hasError('required')) {
      return 'Apellido es requerido';
    }
    return this.lastName.hasError('pattern') ? 'Apellido tiene valores incorrectos' : '';
  }
  getPasswordErrors() {
    if (this.confirmPassword.hasError('required')) {
      return 'Contraseña es requerida';
    }
  }
  getPasswordConfirmErrors() {
    if (this.confirmPassword.hasError('required')) {
      return 'Confirmar Contraseña es requerida';
    }
    return this.confirmPassword.hasError('mustMatch') ? 'La confirmación de contraseña debe coincidir con la contraseña' : '';
  }
  editAccount() {
    if (this.userForm.valid) {
      const { name, lastName } = this.userForm.getRawValue();
      this.isLoading = true;
      this.authenticationService.editAccount(name, lastName)
        .subscribe((account) => {
          this.isLoading = false;
          this.authenticationService.updateIdentity(account).subscribe(() => { });
          this.snackBar.open('Usuario editado correctamente', 'Cerrar', {
            duration: 3500
          });
        }, ({ message, details }) => {
          this.isLoading = false;
          const messageDetail = message || `Error editando datos del usuario`;
          this.snackBar.open(messageDetail, 'Cerrar', {
            duration: 3500
          });
        });
    }
  }

}
