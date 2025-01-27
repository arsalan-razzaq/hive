import { Component, EventEmitter, HostListener, Output } from '@angular/core';
 import { RequestService } from '../../../app/services/request.service';
 import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  screen : any = 'card'


  showDropdown: boolean = false;
  totalPrice: any;
  cart_data: any;
  tempOrderCount: any;
  catlog:any;
  brands:any;
  searchTerm: string = '';
  user: any;
  product_data: any;
  loading: boolean = false;
  cate_gory_data: any;
  brand_data: any;
  current_page: any;
  last_page: any;
  filter:boolean = false;
  selectedCategoryId: number | null = null; // Selected Category
  selectedBrandId: number | null = null; // Selected Brand
  selectedPriceRange: any = ''; // Selected Price Rang
  categoryId: any;
private searchSubject: Subject<string> = new Subject();
  select_product_notify: any;
  currentUrl: string;

  constructor(private route: ActivatedRoute,   private formBuilder: FormBuilder,private api: RequestService,private DataEncrypt : DataEncryptService , private router: Router) {

    this.currentUrl = this.router.url;


    this.searchSubject.pipe(
      debounceTime(500)  // Wait 500ms after typing stops
    ).subscribe(() => {
      // Trigger the HTTP request after debounce
      this.triggerSearchRequest();
    });





    let a:any = localStorage.getItem('catlog')
    this.catlog = JSON.parse(a);
    let b:any = localStorage.getItem('brands')
    this.brands = JSON.parse(b);


    if(localStorage.getItem('user')){
    const loginusers:any = localStorage.getItem('user');

    this.user = this.DataEncrypt.decryptUserData(loginusers);
    }
    this.route.queryParams.subscribe(params => {
      const encryptedId = params['page'];

      if (encryptedId) {
        // Decrypt the ID
        const decryptedId = this.DataEncrypt.decryptUserData(encryptedId);


        // Now you can use the decryptedId to load data or perform other actions
        this.categoryId = decryptedId;
        this .selectedCategoryId = this.categoryId

        this.onFilterChange();


      }
      else{
        this.all_product()
      }
    });

    window.scrollTo(0, 0);









  }


  all_product() {


    this.loading = true;
    this.api.post('product/all',true).subscribe((res: any) => {

      res.data.length == 0 ?  this.product_data = [] : this.product_data = res.data?.data
    this.current_page = res.data.current_page
    this.last_page = res.data.last_page
    this.loading = false;



      },
      (error: any) => {
        this.loading = false;
        if(error.status == 400){
          // this.showDanger('Invalid Username or Password');
        }else{
          // this.showDanger('There is some error');
        }
      }
    );
}
   // Function to call filter API
   onFilterChange() {
    const payload = this.createFilterPayload();
    this.filterProducts(payload);
  }

  // Create the payload for the API request
  createFilterPayload() {
    const payload: any = {};
    if (this.selectedCategoryId) payload.categoryId = this.selectedCategoryId;
    if (this.selectedBrandId) payload.brandId = this.selectedBrandId;
    if (this.selectedPriceRange) payload.priceRange = JSON.parse(this.selectedPriceRange);

    return payload;
  }

  // Call the API with the filter payload
  filterProducts(payload: any) {
    this.filter = true;
    this.loading = true;
    this.api.post('product/filter', {payload}).subscribe((res: any) => {


      res.data.length == 0 ?  this.product_data = [] : this.product_data = res.data?.data
      this.loading = false;

    this.current_page = res.data?.current_page ?? 0
    this.last_page = res.data?.last_page ?? 0
    });
  }
next_product() {


  this.loading = true;
  this.api.post(`product/all?page=${this.current_page + 1}`,true).subscribe((res: any) => {
  this.product_data = res.data.data
  this.current_page = res.data.current_page
  this.last_page = res.data.last_page
      this.loading = false;


    },
    (error: any) => {
      this.loading = false;
      if(error.status == 400){
        // this.showDanger('Invalid Username or Password');
      }else{
        // this.showDanger('There is some error');
      }
    }
  );
}
last_product() {


  this.loading = true;
  this.api.post(`product/all?page=${this.current_page - 1 }`,true).subscribe((res: any) => {
  this.product_data = res.data.data
  this.current_page = res.data.current_page
  this.last_page = res.data.last_page
      this.loading = false;


    },
    (error: any) => {
      this.loading = false;
      if(error.status == 400){
        // this.showDanger('Invalid Username or Password');
      }else{
        // this.showDanger('There is some error');
      }
    }
  );
}

get_product_detail(item: any) {
  // Check if user is present in local storage

    // User exists, proceed with product detail navigation
    const encryptedId = this.DataEncrypt.encryptUserData(item.id);

    // Navigate with the ID as a query parameter
    this.router.navigate(['/Products_Views'], { queryParams: { page: encryptedId } });

}


  encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }

  truncateWords(text: string, wordLimit: number = 4): string {

    if (!text) return '';

    const words = text.split(' ');


    if (words.length <= wordLimit) {
      return text;
    }

    const truncatedText = words.slice(0, wordLimit).join(' ') + '...';

    return truncatedText;
  }

  goToPage(page: number) {

  }


  // Clear all filters
  clearFilters() {
    this .selectedCategoryId = null
    this .selectedBrandId = null
    this .selectedPriceRange = null
    this.filter = false;
    this.all_product();

  }

  onSearchChange() {
    // Log the current search term to the console
    this.searchSubject.next(this.searchTerm);
  }
  triggerSearchRequest() {
    if (this.searchTerm.trim()) {
      this.api.post('product/find',{query:this.searchTerm}).subscribe((res: any) => {


        this.product_data = res.data
      })

    }
    else{
     this.all_product();
    }
  }

notify_us(pop_pro: any) {
  const user = localStorage.getItem('user');
  this.select_product_notify = pop_pro;

  if (user) {
    // If user is logged in
    this.loading = true;
    this.api.post('product/UserNotify', {
      pro_id: this.select_product_notify.id,
      email: this.user.email
    }).subscribe((res: any) => {
       if (res.status === 'success') {
        Swal.fire({
          title: res.status,
          text: res.message,
          icon: 'success', // Success icon
          confirmButtonText: 'OK'
        });
      } else if (res.status === 'error') {
        Swal.fire({
          title: res.status,
          text: res.message,
          icon: 'error', // Error icon
          confirmButtonText: 'OK'
        });
      }
      this.loading = false;
    });
  } else {
    // If user is not logged in
    Swal.fire({
      title: 'Enter Your Email',
      text: 'Please provide your email to be notified when the product is back in stock.',
      input: 'email',  // Input type is email
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (email) => {
        // Check if the email is valid
        if (!email) {
          return 'You need to enter an email address!';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          return 'Please enter a valid email address!';
        }
        return null; // No validation error
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // If user enters an email and confirms
        const email = result.value;
        this.loading = true;

        // Send the email and product id to the API to register for notification
        this.api.post('product/UserNotify', {
          pro_id: this.select_product_notify.id,
          email: email
        }).subscribe((res: any) => {
           if (res.status === 'success') {
            Swal.fire({
              title: 'Thank you!',
              text: 'You will be notified when the product is back in stock.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else if (res.status === 'error') {
            Swal.fire({
              title: 'Error',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
          this.loading = false;
        });
      }
    }).catch((error) => {
      // Handle any error if the alert is dismissed
      console.log('Error:', error);
    });
  }
}





redirectToLogin() {
  // Save the current URL to session storage (or another storage option)
  sessionStorage.setItem('redirectUrl', this.currentUrl);
  // Redirect to login with the URL as a query parameter
  this.router.navigate(['/Login'], { queryParams: { redirectUrl: this.currentUrl } });
}

}
