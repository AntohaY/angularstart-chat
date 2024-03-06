import { Component, effect, inject } from "@angular/core";
import { MessageListComponent } from "./ui/message-list.component";
import { MessageService } from "../shared/data-access/message.service";
import { MessageInputComponent } from "./ui/message-input.component";
import { AuthService } from "../shared/data-access/auth.service";
import { Router } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
    standalone: true,
    selector: 'app-home',
    template: `
        <div class="container">
            <mat-toolbar color="primary">
                <span class="spacer"></span>
                <button mat-icon-button (click)="authService.logout()">
                    <mat-icon>logout</mat-icon>
                </button>
            </mat-toolbar>

            <app-message-list [messages]="messageService.messages()" [activeUser]="authService.user()"></app-message-list>
            <app-message-input (save)="messageService.add$.next($event)"></app-message-input>
        </div>
    `,
    imports: [MessageListComponent, MessageInputComponent, MatIcon, MatToolbarModule, MatButtonModule],
    styles: [
        `
          .container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }
    
          mat-toolbar {
            box-shadow: 0px -7px 11px 0px var(--accent-color);
          }
    
          app-message-list {
            height: 100%;
            width: 100%;
          }
    
          app-message-input {
            position: fixed;
            bottom: 0;
          }
        `,
      ],
})

export default class HomeComponent {
    messageService = inject(MessageService);
    authService = inject(AuthService);
    router = inject(Router);

    constructor() {
        effect(() => {
            if (!this.authService.user()) {
                this.router.navigate(['auth', 'login']);
            }
        })
    }
}