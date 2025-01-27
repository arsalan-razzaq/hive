import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.css']
})
export class ThanksComponent {

 

  constructor() {
    window.scrollTo(0, 0);

  }

  ngOnInit(): void {
    this.showDownloadPrompt();
  }

  showDownloadPrompt() {
    setTimeout(() => {
      Swal.fire({
        title: 'Download Invoice',
        text: 'Do you want to download this billing invoice?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, download it!',
        cancelButtonText: 'No, thanks'
      }).then((result) => {
        if (result.isConfirmed) {
          this.downloadInvoice();
        }
      });
    }, 5000); // 5 seconds delay
  }

  downloadInvoice() {
    const invoiceLink = 'path/to/your/invoice.pdf'; // Change this to your invoice path
    const a = document.createElement('a');
    a.href = invoiceLink;
    a.download = 'Invoice.pdf'; // You can dynamically set this based on the order number or date
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
