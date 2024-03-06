import { Component, effect, inject } from "@angular/core";
import { RegisterFormComponent } from "./ui/register-form.component";
import { RegisterService } from "./data-access/register.service";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../shared/data-access/auth.service";

@Component({
    standalone: true,
    selector: 'app-register',
    template: `
        <div class="container gradient-bg">
            <app-register-form 
                [status]="registerService.status()" 
                (register)="registerService.createUser$.next($event)">
            </app-register-form>
            <a routerLink="/auth/login">Back to Login</a>
        </div>
    `,
    styles: [`
        a {
            margin: 2rem;
            color: var(--accent-darker-color);
        }
    `],
    providers: [RegisterService],
    imports: [RegisterFormComponent, RouterModule]
})
export default class RegisterComponent {
    public registerService = inject(RegisterService);
    public router = inject(Router);
    private authService = inject(AuthService);

    constructor() {
        effect(() => {
            if (this.authService.user()) {
                this.router.navigate(['/home']);
            }
        })
    }
}