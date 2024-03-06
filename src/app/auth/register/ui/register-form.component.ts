import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterStatus } from '../data-access/register.service';
import { Credentials } from '../../../shared/interfaces/credentials';
import { passwordMatchesValidator } from '../utils/password-matches';

@Component({
    standalone: true,
    selector: 'app-register-form',
    styles: [`
        form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        button {
            width: 100%;
        }

        mat-error {
            margin: 5px 0;
        }

        mat-spinner {
            margin: 1rem 0;
        }
    `],
    template: `
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" #form="ngForm">
            <mat-form-field appearance="fill">
                <mat-label>email</mat-label>
                <input 
                    matNativeControl
                    formControlName="email"
                    type="email"
                    placeholder="email"
                >
                <mat-icon matPrefix>email</mat-icon>
                @if( (registerForm.controls.email.dirty || form.submitted) &&
                !registerForm.controls.email.valid ) {
                    <mat-error>Please provide a valid email</mat-error>
                }
            </mat-form-field>
            <mat-form-field>
                <mat-label>password</mat-label>
                <input 
                    matNativeControl
                    formControlName="password"
                    data-test="create-password-field"
                    type="password"
                    placeholder="password"
                >
                <mat-icon matPrefix>lock</mat-icon>
                @if( (registerForm.controls.password.dirty || form.submitted) &&
                !registerForm.controls.password.valid ){
                    <mat-error>Password must be at least 8 characters long</mat-error>
                }
            </mat-form-field>
            <mat-form-field appearance="fill">
                <mat-label>confirm password</mat-label>
                <input 
                    matNativeControl
                    formControlName="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                >
                <mat-icon matPrefix>lock</mat-icon>
                @if( (registerForm.controls.confirmPassword.dirty || form.submitted) &&
                registerForm.hasError('passwordMatch') ){
                    <mat-error>Must match password field</mat-error>
                }
            </mat-form-field>

            @if (status === 'error'){
                <mat-error>Could not create account with those details.</mat-error>
            } @else if(status === 'creating'){
                <mat-spinner diameter="50"></mat-spinner>
            }

            <button
                mat-raised-button
                color="accent"
                type="submit"
                [disabled]="status === 'creating'"
            >
                Submit
            </button>
        </form>
    `,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ]
})
export class RegisterFormComponent {
    @Input({ required: true }) status!: RegisterStatus;
    @Output() register = new EventEmitter<Credentials>();

    private formBuilder = inject(FormBuilder);

    registerForm = this.formBuilder.nonNullable.group(
        {
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        },
        {
            updateOn: 'blur',
            validators: [passwordMatchesValidator],
        }
    );

    onSubmit() {
        if (this.registerForm.valid) {
            const { confirmPassword, ...credentials } = this.registerForm.getRawValue();

            // More simple example of the code above
            // const values = this.registerForm.getRawValue();

            // const credentials: Credentials = {
            //     email: values.email,
            //     password: values.password
            // }

            this.register.emit(credentials);
        }
    }
}