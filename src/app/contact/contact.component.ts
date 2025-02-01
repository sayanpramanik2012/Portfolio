import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: false,

  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  @Output() close = new EventEmitter<void>();

  name: string = '';
  email: string = '';
  message: string = '';

  onSubmit() {
    // Handle form submission (e.g., send data to an API)
    console.log('Form submitted:', {
      name: this.name,
      email: this.email,
      message: this.message,
    });
    this.closePopup();
  }

  closePopup() {
    this.close.emit();
  }
}
