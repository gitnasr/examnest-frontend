import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      <label [htmlFor]="id" class="block mb-2 text-sm font-medium text-gray-300">{{ label }}</label>
        <input 
          [id]="id"
          [name]="name"
          [type]="type"
          [(ngModel)]="value"
          (ngModelChange)="valueChange.emit($event)"
          [required]="required"
          
          class="block w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [placeholder]="placeholder">
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class FormInputComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() type: string = 'text';
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
} 