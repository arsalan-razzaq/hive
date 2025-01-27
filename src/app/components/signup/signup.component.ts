
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  @ViewChild('input1') input1!: ElementRef;
  @ViewChild('input2') input2!: ElementRef;
  @ViewChild('input3') input3!: ElementRef;
  @ViewChild('input4') input4!: ElementRef;
  @ViewChild('input5') input5!: ElementRef;
  @ViewChild('input6') input6!: ElementRef;
   loading: boolean = false; 
   Signuo_form : any
   btn_loading : boolean = false
  user: any;
  alertMessage: string | null = null;
isSuccess: boolean = true;
screen :any = 'main_view'
   constructor(private formBuilder: FormBuilder , private router: Router,private api: RequestService,private DataEncrypt : DataEncryptService) {

    this.Signuo_form = this.formBuilder.group({
      name:['', Validators.required],
      email:['', Validators.required],
      number:['', Validators.required],
      password: ['', Validators.required],
     
 
     });


   }
   signup() {
    console.log(this.Signuo_form.value);
  
    if (this.Signuo_form.valid) {
      this.btn_loading = true;
      this.loading = true;
  
      this.api.post('user/add', this.Signuo_form.value).subscribe(
        (res: any) => {
          this.loading = false;
          this.btn_loading = false;
  
          if (res.status_code === 402 || res.status === 'error') {
            this.loading = false;
            this.showAlert(res.message || 'Something went wrong. Please try again.', false);
            return; // Exit the function if there is an error
          } else {
            this.showAlert(res.message || 'Signup successful!', true);
            this.screen= 'verify_view'
  
          
          }
        },
        (error: any) => {
          this.loading = false;
          this.btn_loading = false;
  
          if (error.status === 400) {
            this.showAlert('Invalid input. Please check your form.', false);
          } else {
            this.showAlert('Something went wrong. Please try again.', false);
          }
        }
      );
    }
  }
   encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }

  showAlert(message: string, isSuccess: boolean) {
    this.alertMessage = message;
    this.isSuccess = isSuccess;
  
    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }
  





  // Move focus to the next input when a value is entered
  moveFocus(event: any, nextInput: any) {
    if (event.target.value.length === 1) {
      nextInput.focus();
    }
  }

  verifyCode() {
    const code = [
      this.input1.nativeElement.value,
      this.input2.nativeElement.value,
      this.input3.nativeElement.value,
      this.input4.nativeElement.value,
      this.input5.nativeElement.value,
      this.input6.nativeElement.value
    ].join('');

    console.log('Verification Code:', code);

  const payload = {
    email : this.Signuo_form.value.email , 
    code : code
  }
    if(code){
      this.loading = true;

      this.api.post('verify', payload).subscribe(
        (res: any) => {
          this.loading = false;

          if (res.status_code === 402) {
            // Show the error message from the response
            this.showAlert(res.message || 'Something went wrong. Please try again.' , false);
   

         
            return;  // Exit the function if there is an error
          }

          if (res.status === 'error') {
            // Show the error message from the response
            this.showAlert(res.message || 'Something went wrong. Please try again.' , false);
            return;  // Exit the function if there is an error
          }else{
          localStorage.setItem('bearer_token', res.token);
          const encryptedUser = this.encryptUserData(res.data);
          localStorage.setItem('user', encryptedUser);
          window.location.href = '/';
           const loginusers: any = localStorage.getItem('user');
          this.user = this.DataEncrypt.decryptUserData(loginusers);
          }
        },
        (error: any) => {
          this.loading = false;
          if (error.status === 400) {
            // Handle error for invalid response
          } else {
            // Handle generic error
          }
        }
      );
    }
  }

}