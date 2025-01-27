import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  EventEmitter, Output } from '@angular/core';
 import { RequestService } from '../../../app/services/request.service';
 import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {

  quantity: number = 1;
  totalPrice: any;
  loading : boolean = false
  categoryId: any;
  product_data: any;
  popular_products: any;
  currentIndex: number = 0;
  previousIndex: number = 0;
  interval: any;
  alertMessage: string | null = null;
isSuccess: boolean = true;
  user: any;
  select_product_notify: any;
  selected_variant: any;
  constructor(private modalService: NgbModal ,   private route: ActivatedRoute, private formBuilder: FormBuilder , private router: Router,private api: RequestService,private DataEncrypt : DataEncryptService) {
    // Get the query parameter 'page'
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
     this.product_view()
  }


  defaultImage : any; // Set your default image path here


  product_view() {
    this.loading = true;
    this.api.post('product/detail', { "id" : this.categoryId }).subscribe(
      (res: any) => {
        this.product_data = res.data;
        this.qty();
        this.totalPrice = this.product_data.price
        this.defaultImage = this.product_data.product_image[0].image;


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

  startImageRotation() {
    this.interval = setInterval(() => {
      this.previousIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex + 1) % this.product_data.product_image.length;
    }, 5000); // Change image every 5 seconds
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Clear interval when component is destroyed
  }

  incrementQuantity() {
    this.quantity += 1;
    this.updateTotalPrice();
  }

  // Decrease quantity and update total price, ensuring quantity doesn't go below 1
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.updateTotalPrice();
    }
  }

  // Update the total price based on the current quantity
  updateTotalPrice() {
    this.totalPrice = this.product_data.price * this.quantity;
  }

  setCurrentImage(index: number): void {
    this.previousIndex = this.currentIndex; // Store previous index
    this.currentIndex = index; // Update current index
  }
  showAlert(message: string, isSuccess: boolean) {
    this.alertMessage = message;
    this.isSuccess = isSuccess;

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }
      addToCart() {

        console.log(this.user);

        if(this.user == undefined || !this.user){
          Swal.fire({
            title: 'Login required',
            text: 'You need to log in before adding products to your cart.',
            icon: 'error',
            showCancelButton: true,
          });
          return;
        }


      // Initializing an array to store product and variant data
  let itemsList: any[] = [];
  let totalPrice: number = 0; // Initializing the total price

  // Check if the product has variants
  if (this.product_data.variant.length == 0) {
    // If there are no variants, add the single product details
    itemsList = [
      {
        pro_id: this.product_data.id,
        qty: this.quantity,
        price: this.product_data.price * this.quantity,
        type: 'Single',
        v_id:this.selected_variant?.id
      }
    ];
    // Calculate the total price for a single product
    totalPrice = this.product_data.price * this.quantity;
  } else {
    // Filter variants where the quantity is greater than 0
    const cartItems = this.product_data.variant.filter((variant: any) => variant.quantity > 0);
  console.log(cartItems)
  if(cartItems.length == 0){

    Swal.fire({
      title: 'Varient',
      text: 'No variants selected',
      icon: 'error',
      showCancelButton: true,
    });

  return;
  }

    // Map over the filtered variants and create a list of items with relevant data
    itemsList = cartItems.map((variant: any) => {
      const itemPrice = parseFloat(variant.pirce) * variant.quantity;
      totalPrice += itemPrice; // Accumulate the total price

      return {
        pro_id: this.product_data.id, // Product ID
        qty: variant.quantity, // Quantity of the variant
        price: itemPrice, // Total price for the variant
        type: 'Variant', // Type indicating it's a variant
        v_id: variant.id // Variant ID
      };
    });
  }

  ;

  // Construct the payload with all required data
  const payload = {
    total: totalPrice,
    product_id: this.product_data.id,
    discount: "", // Set discount if applicable
    discounted_price: "", // Set discounted price if applicable
    customer_id: this.user.id,
    list: itemsList // List of items to include in the payload
  };

  // Log the payload to the console for verification




      // console.log('Cart Items:', cartItems);

    this.loading = true
      this.api.post('temp_order/add',payload).subscribe(
        (res: any) => {
          this.showAlert(res.message || 'Signup successful!', true);
          this.router.navigate(['/Cart']);
  this.modalService.dismissAll()
  window.location.reload()
  this.loading = false;


          console.log('Payload:', payload); // Optional: Log the payload to verify structure
        },
        (error: any) => {
          this.loading = false;
          if (error.status === 400) {
            this.loading = false
            // Handle specific error
          } else {
            this.loading = false

            // Handle general error
          }
        }
      );
    }



  truncateText(text: string, wordLimit: number): string {
    if (!text) return '';

    const wordsArray = text.split(' ');  // Split text by spaces
    if (wordsArray.length > wordLimit) {
      return wordsArray.slice(0, wordLimit).join(' ') + '...';  // Join the first 'wordLimit' words and add '...'
    }

    return text;  // Return the original text if it's within the limit
  }

  incrementQuantityy(variant: any) {

    if (variant.quantity < variant.stock) {
      variant.quantity++;
    }
  }

  decrementQuantityy(variant: any) {
    if (variant.quantity > 0) {
      variant.quantity--;
    }
  }

  qty(){
    this.product_data.variant.forEach((varr:any) => {
      if (!varr.hasOwnProperty('quantity')) {
        varr.quantity = 0;
      }
    });
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
onCategoryClick(item: any) {
  const user = localStorage.getItem('user');


    const encryptedId = this.DataEncrypt.encryptUserData(item);

  // Navigate with the ID as a query parameter
  this.router.navigate(['/Pro'], { queryParams: { page: encryptedId } });

}selectedTab: number = 1;
selectTab(tabNumber: number): void {
  this.selectedTab = tabNumber;
}



pop(cart_Added: any  ) {

  this.modalService.open(cart_Added, {
   ariaLabelledBy: 'modal-basic-title',
   centered: true,
   windowClass: 'modal_booking'
 }).result.then((result) => {
   // Modal closed
 }, (reason) => {
   // Modal dismissed
 });
}


close_modal(){
  this.modalService.dismissAll()
}
}
