
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  EventEmitter, Output } from '@angular/core';
 import { RequestService } from '../../../app/services/request.service';
 import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {


  quantity: number = 1;
  totalPrice: any;
  loading : boolean = false
  cart_data: any;
  alertMessage: string | null = null;
  isSuccess: boolean = true;
  user: any;
  categoryId: any;
  product_data: any;
  totalSum: any;
  citi:any
  unsavedChanges: boolean = false;
  selectedProduct: any;
  isModalOpen = false;
  scrreen_order:any = 'main'
  menuItems: string[] = [
    'Profile',
    'Orders',
    'Change Password',
     
    'Return Policy',
    'Privacy Policy',
  ];
  screen: string = 'Profile'; // Default screen
  selected_item: any;
  password_form: any;
  loading_btn : boolean = false
  profile_form: any;
  
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder , private router: Router,private api: RequestService,private DataEncrypt : DataEncryptService) {
    
   
    window.scrollTo(0, 0);
    this.route.queryParams.subscribe(params => {
      const encryptedId = params['page'];

      if (encryptedId) {
        // Decrypt the ID
        const decryptedId = this.DataEncrypt.decryptUserData(encryptedId);
        console.log('Decrypted ID:', decryptedId);

        // Now you can use the decryptedId to load data or perform other actions
        this.categoryId = decryptedId;
      }
    });
    if(localStorage.getItem('user')){
      const loginusers:any = localStorage.getItem('user');
  
      this.user = this.DataEncrypt.decryptUserData(loginusers);  
      }
     this.all_orders()
     this.password_form = this.formBuilder.group({
      email:[this.user?.email, Validators.required],
      new_password: ['', Validators.required],
      old_password: ['', Validators.required],

 
     });

     this.profile_form = this.formBuilder.group({
      id:[this.user.id],
       name:[this.user?.name],
      number:[this.user?.number],
      country:[this.user?.country],
      address:[this.user?.address],
      city:[this.user?.city],


     
 
     });
     
  }
 
 
view(item:any){
  this.selected_item = item
  this.scrreen_order = 'view'
}
  all_orders() {
    this.loading = true;
    this.api.post('order/all', { "customer_id" : this.user.id }).subscribe(
      (res: any) => {
        this.cart_data = res.data.detail.data;
         
 
 this.loading = false;
   
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

  openModal(order: any) {
    this.selectedProduct = order;
    console.log(order);
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }
  selectScreen(item: string) {
    this.screen = item;
    console.log(item)
  }
logout(){
  this.loading = true
  localStorage.clear()
  window.location.reload()
  this.router.navigate(['/Login']);
  this.loading  = false

}
change_password() {
 
  if(this.password_form.valid){
    this.loading_btn = true
    console.log(this.password_form.value)
    this.loading = true;
  
    this.api.post('change_password', this.password_form.value).subscribe(
      (res: any) => {
        this.loading = false;
        this.loading_btn = true
        
        if (res.status == 'error') {
          // Show the error message from the response
          Swal.fire({
            title: res.status,
            text: res.message,
            icon: 'success', // Success icon
            confirmButtonText: 'OK'
          });

       this.loading = false
this.loading_btn = false
       return;  // Exit the function if there is an error
        }

        if (res.status === 'status') {
          Swal.fire({
            title: res.status,
            text: res.message,
            icon: 'success', // Success icon
            confirmButtonText: 'OK'
          });

       this.loading = false
this.loading_btn = false
localStorage.clear();

           return;  // Exit the function if there is an error
        }
      },
      (error: any) => {
        this.loading = false;
        this.loading_btn = true
        Swal.fire({
          title:'error',
          text: 'try Again Later',
          icon: 'error', // Success icon
          confirmButtonText: 'OK'
        });

      }
    );
  }
  
 }
 update_profile() {
  if (this.profile_form.valid) {
    this.loading_btn = true;
    this.loading = true;

    // Log form values before making API call (optional for debugging)
    console.log(this.profile_form.value);

    // API call to update the profile
    this.api.post('user/update', this.profile_form.value).subscribe(
      (res: any) => {
        // Handle successful response
        this.loading = false;
        this.loading_btn = false;

        if (res.status === 'error') {
          // Show error message if the response status is 'error'
          Swal.fire({
            title: res.status,
            text: res.message,
            icon: 'error', // Error icon
            confirmButtonText: 'OK'
          });
          return; // Exit the function on error
        }

        if (res.status === 'status') {
          // Successful update, show success message
          Swal.fire({
            title: 'Profile Updated',
            text: res.message,
            icon: 'success', // Success icon
            confirmButtonText: 'OK'
          });

          // Patch the form with updated user data
          this.profile_form.patchValue({
             name: res.data.name,
            number: res.data.number,
            country: res.data.country,
            address: res.data.address,
            city: res.data.city
          });
          localStorage.setItem('user', JSON.stringify(res.data));

          return; // Exit the function after success
        }
      },
      (error: any) => {
        // Handle error in API call
        this.loading = false;
        this.loading_btn = false;

        Swal.fire({
          title: 'Error',
          text: 'Please try again later',
          icon: 'error', // Error icon
          confirmButtonText: 'OK'
        });
      }
    );
  }
}

 cities(){
  const ksaCities = [
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Khobar",
    "Tabuk",
    "Buraydah",
    "Khamis Mushait",
    "Al Hufuf",
    "Hafar Al-Batin",
    "Jubail",
    "Al Kharj",
    "Qatif",
    "Abha",
    "Najran",
    "Yanbu",
    "Al Qunfudhah",
    "Al Mubarraz",
    "Arar",
    "Sakakah",
    "Al Bahah",
    "Al Namas",
    "Rabigh",
    "Al-Ula",
    "Duba",
    "Rafha",
    "Al Wajh",
    "Turabah",
    "Dawadmi",
    "Turaif",
    "Al Qurayyat",
    "Sharurah",
    "Afif",
    "Wadi Al-Dawasir",
    "Samitah",
    "Al Lith",
    "Addayer",
    "Al-Kamil",
    "Al Majma'ah",
    "Al Jouf",
    "Al 'Uyayna",
    "Bisha",
    "Al Quwai'iyah",
    "Al Jumum"
  ];
  const uaeCities = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",
    "Dibba Al-Fujairah",
    "Khor Fakkan",
    "Kalba",
    "Dhaid",
    "Madha",
    "Hatta"
  ];

  this.profile_form.value.country == 1 ? this.citi = ksaCities : uaeCities
  console.log(this.citi)
  console.log(this.profile_form.value.country)

}
}
