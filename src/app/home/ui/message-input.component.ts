import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-message-input',
    template: `
        <section>
            <form [formGroup]="messageInputFormGroup" (ngSubmit)="save.emit(messageInputFormGroup.controls.content.value); messageInputFormGroup.reset()">
                @for(control of messageInputFormGroup.controls | keyvalue; track control.key) {
                    <input 
                        type="text"
                        [id]="control.key"
                        [formControlName]="control.key"
                        placeholder="type a message"
                    />
                }
                <button mat-button type="submit">
                    <mat-icon>send</mat-icon>
                </button>
            </form>
        </section>
    `,
    standalone: true,
    styles: [
        `
          :host {
            width: 100%;
            position: relative;
          }
    
          input {
            width: 100%;
            background: var(--white);
            border: none;
            font-size: 1.2em;
            padding: 2rem 1rem;
          }
    
          button {
            height: 100% !important;
            position: absolute;
            right: 0;
            bottom: 0;
    
            mat-icon {
              margin-right: 0;
            }
          }
        `,
      ],
    imports: [FormsModule, ReactiveFormsModule, KeyValuePipe, MatButtonModule, MatIconModule]
})

export class MessageInputComponent {
    formBuilder = inject(FormBuilder);

    messageInputFormGroup = this.formBuilder.nonNullable.group({
        content: [''],
    });

    @Output() save = new EventEmitter<string>();
}