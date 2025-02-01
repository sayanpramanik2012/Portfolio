import { Component, Output, EventEmitter } from '@angular/core';
import emailjs from 'emailjs-com';

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
  notsend: boolean = false;
  notsendTechicalIssue: boolean = false;
  notifisent: boolean = false;

  // onSubmit() {
  //   // Handle form submission (e.g., send data to an API)
  //   console.log('Form submitted:', {
  //     name: this.name,
  //     email: this.email,
  //     message: this.message,
  //   });
  //   this.closePopup();
  // }

  onSubmit() {
    if (this.name !== '' && this.email !== '' && this.message !== '') {
      const serviceID = 'service_4hj0lcs'; // Replace with your EmailJS service ID
      const templateID = 'template_lhjotkf'; // Replace with your EmailJS template ID
      const userID = '1Lu8_ljivTRipUC7P'; // Replace with your EmailJS user ID

      const templateParams = {
        from_name: this.name,
        from_email: this.email,
        message: this.message,
      };

      emailjs
        .send(serviceID, templateID, templateParams, userID)
        .then((response) => {
          console.log('Email sent successfully!', response);
          this.notifisent = true;
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          this.notsendTechicalIssue = true;
        });
    } else {
      this.notsend = true;
    }
  }

  closePopup() {
    this.close.emit();
  }
}
