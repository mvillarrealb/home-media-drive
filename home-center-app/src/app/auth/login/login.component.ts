import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  isLoading = false;

  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly accountsService: AccountsService,
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
    });
  }

  submit() {
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.isLoading = true;
      this.accountsService
        .login(email, password)
        .subscribe((user) => {
          this.isLoading = false;
          this.router.navigate(['/drive']);
        }, ({ error }) => {
          this.error = error.message || 'Ha ocurrido un error iniciando sesión';
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
  getPasswordErrors() {
    if (this.password.hasError('required')) {
      return 'Contraseña es requerida';
    }
  }
  get email() {
    return this.form.get('email');
  }
    
  get password() {
    return this.form.get('password');
  }

}
