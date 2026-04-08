import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="control && control.invalid && (control.dirty || control.touched)">
      <div *ngIf="control.errors?.['required']">
        This field is required.
      </div>

      <div *ngIf="control.errors?.['minlength']">
        Minimum length is
        {{ control.errors?.['minlength'].requiredLength }} characters.
      </div>

      <div *ngIf="control.errors?.['maxlength']">
        Maximum length is
        {{ control.errors?.['maxlength'].requiredLength }} characters.
      </div>

      <div *ngIf="control.errors?.['email']">
        Please enter a valid email.
      </div>
    </div>
  `,
  styles: [`div { color: red; font-size: 0.8em; }`],
})
export class ValidationMessage {
  @Input() control: AbstractControl | null = null;
}