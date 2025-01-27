import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider } from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   
  screen : any = 'login_view'
   user: any;
   product_data: any;
   loading: boolean = false; 
   login_form : any
   btn_loading : boolean = false
   gmail_login:any
   @ViewChildren('verificationInputforun') verificationInputsforun!: QueryList<ElementRef>;
  login_data: any;

   constructor(    private auth: Auth, private formBuilder: FormBuilder , private router: Router,private api: RequestService,private DataEncrypt : DataEncryptService) {
    window.scrollTo(0, 0);

    this.login_form = this.formBuilder.group({
      email:['', Validators.required],
      password: ['', Validators.required],
     
 
     });


   }
  login() {
    console.log(this.login_form.value)

     if(this.login_form.valid){
      console.log(this.login_form.value)
      this.loading = true;
    
      this.api.post('login', this.login_form.value).subscribe(
        (res: any) => {
          this.loading = false;

          
          if (res.status_code === 402) {
            // Show the error message from the response
            this.showAlerts(res.message || 'Something went wrong. Please try again.');
   

         
            return;  // Exit the function if there is an error
          }

          if (res.status === 'error') {
            // Show the error message from the response
            this.showAlerts(res.message || 'Something went wrong. Please try again.');
            return;  // Exit the function if there is an error
          }else{
          localStorage.setItem('bearer_token', res.authorisation.token);
          const encryptedUser = this.encryptUserData(res.user);
          localStorage.setItem('user', encryptedUser);
          window.location.href = '/';
           const loginusers: any = localStorage.getItem('user');
          this.user = this.DataEncrypt.decryptUserData(loginusers);
          const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectUrl'); // Clear redirect URL after use
          window.location.href = redirectUrl;
        } else {
          window.location.href = '/'; // Redirect to home if no redirect URL
        }
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
   encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }



  async loginWithGoogle() {
    this.btn_loading = true
    this.loading = true;

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('User logged in:', result.user);
      this.gmail_login = result.user;
  console.log(this.gmail_login)
      this.api.post('user/add', { 
        email: this.gmail_login.email, 
        type: 'gmail',  
        email_verified_at: 'true', 
        name: this.gmail_login.displayName, 
        image:this.gmail_login.photoURL,
        verify: 'true' 
      }).subscribe(
        (res: any) => {
          if (res.status === 'success') {
            this.btn_loading = true;
  
            const username = this.gmail_login.email;
            const type = 'gmail';
            this.loading = true;
  
            this.api.post('login', { 
        email: this.gmail_login.email, 
        type: 'gmail',  
      }).subscribe(
              (res: any) => {
                this.loading = false;
                this.btn_loading = false;
  
                if (res.status_code === 402) {
                  // Show the error message from the response
                  this.showAlerts(res.message || 'Something went wrong. Please try again.');
         
  
               
                  return;  // Exit the function if there is an error
                }
  
                if (res.status === 'error') {
                  // Show the error message from the response
                  this.showAlerts(res.message || 'Something went wrong. Please try again.');
                  return;  // Exit the function if there is an error
                }
  
               
  
               
                  localStorage.setItem('bearer_token', res.authorisation.token);
                  const encryptedUser = this.encryptUserData(res.user);
                  localStorage.setItem('user', encryptedUser);
                  // window.location.href = '/';
                  localStorage.setItem('authantication', this.encryptUserData('approved'));
                  const redirectUrl = sessionStorage.getItem('redirectUrl');
                  if (redirectUrl) {
                    sessionStorage.removeItem('redirectUrl'); // Clear redirect URL after use
                    window.location.href = redirectUrl;
                  } else {
                    window.location.href = '/'; // Redirect to home if no redirect URL
                  }
                this.btn_loading = false

              },
              (error: any) => {
                this.btn_loading = false;
                this.loading = false;
  
                if (error.status === 400) {
                  this.showAlerts('Something went wrong. Please try again.');
                } else {
                  this.showAlerts('Check Login Fields & Password Try Again');
                }
              }
            );
          }
        },
        (error: any) => {
          this.btn_loading = false
          console.error('Post request failed:', error);
        }
      );
    } catch (error) {
      this.btn_loading = false

      console.error('Login failed', error);
    }
  }
  showAlerts(message: string): void {
    const alertContainer = document.getElementById('alert-container'); // Ensure alert-container exists in your HTML
    
    if (alertContainer) {
      // Clear any existing alerts
      alertContainer.innerHTML = ''; 
      
      // Create a new alert div
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-danger alert-dismissible fade show';
      
      // Set the role attribute using setAttribute
      alertDiv.setAttribute('role', 'alert');
    
      // Set the content of the alert
      alertDiv.innerHTML = `
        <strong>Error!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
    
      // Append the new alert to the alert-container
      alertContainer.appendChild(alertDiv);
    }
  }

  private getVerificationCodeforun(): string[] {
    return this.verificationInputsforun.map(input => input.nativeElement.value);
  }
  moveToNextInputforun(index: number): void {
    if (this.verificationInputsforun.toArray()[index].nativeElement.value.length === 1 && index < 5) {
      this.verificationInputsforun.toArray()[index + 1].nativeElement.focus();
    }
  }
  
  moveToPreviousInputforun(index: number): void {
    if (this.verificationInputsforun.toArray()[index].nativeElement.value === '' && index > 0) {
      this.verificationInputsforun.toArray()[index - 1].nativeElement.focus();
    }
  }

 

}