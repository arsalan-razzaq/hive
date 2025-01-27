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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent  {


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
  unsavedChanges: boolean = false;

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
     this.all_cart()
  }



  all_cart() {
    this.loading = true;
    this.api.post('temp_order/all', { "customer_id" : this.user.id }).subscribe(
      (res: any) => {
        this.cart_data = res.data;
        if (res.data ) {
          this.calculateTotalPrice();
        }

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



  incrementQuantity(item: any): void {
    if (item && item.qty !== undefined) {
      item.qty++;
      this.calculateTotalPrice()
      this.unsavedChanges = true; // Mark as having unsaved changes
      this.updateCart()

    } else {
      console.warn('Item or quantity is undefined');
    }
  }



   decrementQuantity(item: any): void {
    if (item && item.qty !== undefined && item.qty > 1) {
      item.qty--;
      this.calculateTotalPrice()
      this.unsavedChanges = true; // Mark as having unsaved changes
      this.updateCart()

    } else {
      console.warn('Item or quantity is undefined or already at minimum');
    }
  }

  clear_cart() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to clear your cart?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call your API to clear the cart
        this.api.post('temp_order/empty_card', {user_id : this.user?.id}).subscribe(
          () => {
              this.all_cart();
              window.location.reload()
              this.loading = false;
              Swal.fire(
                'Cleared!',
                'Your cart has been cleared.',
                'success'
              );
          },
          () => {
              this.loading = false;
          }
      );      
      } else {
        Swal.fire(
          'Cancelled',
          'Your cart is safe :)',
          'info'
        );
      }
    });
  }
  
   
  removeFromCart(cart: any) {
    console.log(cart);
    this.loading = true;

    // Correct the object syntax
    const payload = {
        customer_id: this.user.id,
        remove_list: [cart.id] // Send an array of IDs directly
    };

    // If you want to use the payload in the API call
    this.api.post('temp_order/update', payload).subscribe(
        () => {
            this.all_cart();
            window.location.reload()
            this.loading = false;
        },
        () => {
            this.loading = false;
        }
    );
}



calculateTotalPrice(): void {
  // this.totalPrice = this.cart_data?.temp_order_list?.reduce((sum: number, item: { product: { price: number }; qty: number }) => {
  //   return sum + (item.product.price * item.qty);
  // }, 0) || 0;  // Default to 0 if temp_order_list is null or undefined
console.log(this.cart_data?.temp_order_list)
  console.log(this.totalPrice);
}





  addToCart() {
    this.loading = true;

    const payload = {
      total: this.totalPrice,
      customer_id: this.user.id,
      list: this.cart_data.map((cart: any) => ({
        pro_id: cart.product.id,
        qty: cart.qty ,
        price :  cart.product.price * cart.qty
      }))
    };

    this.api.post('temp_order/add', payload).subscribe(
      () => {
        this.router.navigate(['/Cart']);
        this.loading = false;

      },
      () => {
        this.loading = false;

      }
    );
  }



  showAlert(message: string, isSuccess: boolean) {
    this.alertMessage = message;
    this.isSuccess = isSuccess;

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }



  truncateText(text: string, wordLimit: number): string {
    if (!text) return '';

    const wordsArray = text.split(' ');  // Split text by spaces
    if (wordsArray.length > wordLimit) {
      return wordsArray.slice(0, wordLimit).join(' ') + '...';  // Join the first 'wordLimit' words and add '...'
    }

    return text;  // Return the original text if it's within the limit
  }




  updateCart(): void {
    this.loading = true;

    const productList = this.cart_data.temp_order_list.map((item: { product: {
      price: any; id: any;
}; qty: any;   price :any}) => ({
      pro_id: item.product.id,
      qty: item.qty,
      price : item.product.price *  item.qty
    }));

    console.log(productList);
    this.loading  =true
    const payload = {
      list : productList,
      customer_id: this.user.id,

    };

    this.api.post('temp_order/update', payload).subscribe(
      () => {
        this.all_cart()
        this.loading = false;

      },
      () => {
        this.loading = false;
      }
    );
  }




  canDeactivate(): Promise<boolean> {
    if (!this.unsavedChanges) return Promise.resolve(true);

    return Swal.fire({
      title: 'Unsaved changes!',
      text: 'You have unsaved changes. Do you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave it!',
      cancelButtonText: 'No, stay here!',
    }).then((result) => {
      return result.isConfirmed;
    });
  }


  moveto_checkout(){
    this.updateCart()
    this.router.navigate(['/Checkout']);

  }
  var_name(v_id:any,pro:any){

if(pro.variant.length > 0){

    const result = pro.variant.find((item:any) => item.id == v_id);
   return `( ${result.name} )`; 
}
return;
  }

  pp(a:any){
    console.log(a)
    if(a.v_id == null){
      return a.product.price
    }
    else{
      const result = a.product.variant.find((item:any) => item.id == a.v_id);
   return result.pirce
   
    }
   
  }
  totalPrices(cart:any){
    let final_pr: number = 0; // Initialize final price

const updatedCart = cart.temp_order_list.map((item:any) => {
    let totalPrice = 0;

    // Check if the item type is 'Single'
    if (item.type === 'Single') {
        totalPrice = parseFloat(item.price) * item.qty; // Multiply price by quantity
    } else {
        totalPrice = parseFloat(item.price); // Just add the price if it's not 'Single'
    }

    // Add the total price for this item to the final price
    final_pr += totalPrice;

    // Return the item with the computed total price
    return {
        ...item,
        totalPrice: totalPrice.toFixed(2), // Add totalPrice property formatted to 2 decimal places
    };
});

console.log(updatedCart);
this.totalPrice = final_pr.toFixed(2)
console.log("Total Final Price: ", final_pr.toFixed(2)); // Log the final price after the loop

  }

  get_product_detail(item: any) {
    // Check if user is present in local storage
    const user = localStorage.getItem('user');
    const encryptedId = this.DataEncrypt.encryptUserData(item.id);
    this.router.navigate(['/Products_Views'], { queryParams: { page: encryptedId } });
    
  }
}
