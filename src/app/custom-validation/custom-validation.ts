import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custom-validation',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="control && control.invalid && (control.dirty || control.touched)"
    >
      <div *ngIf="control.errors?.['required']">This field is required.</div>
      <div *ngIf="control.errors?.['minlength'] as minLengthError">
        Minimum length is {{ minLengthError.requiredLength }} characters.
      </div>
      <div *ngIf="control.errors?.['maxlength'] as maxLengthError">
        Maximum length is {{ maxLengthError.requiredLength }} characters.
      </div>
      <div *ngIf="control.errors?.['email']">Please enter a valid email.</div>
      <div *ngIf="control.errors?.['pattern']">
        Enter a valid 6-digit code.
      </div>
      <div *ngIf="control.errors?.['min'] as minError">
        Minimum value is {{ minError.min }}.
      </div>
    </div>
  `,
  styles: [`div { color: red; font-size: 0.8em; }`],
})
export class CustomValidation {
  @Input() control: AbstractControl | null = null;
}