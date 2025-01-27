import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { RequestService } from '../../../app/services/request.service';
import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { event } from 'jquery';
declare const Moyasar: any;
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent {



  user: any;
  product_data: any;
  loading: boolean = false;
  checkout_form : any
  btn_loading : boolean = false
  totalPrice: any;
  cart_data: any;
  errorMessage: any;
  formappear:boolean = false
  mee: any;
   constructor(
  private auth: Auth,
  private formBuilder: FormBuilder ,
  private router: Router,
  private api: RequestService,
  private modalService: NgbModal,

  private route: ActivatedRoute,
  private DataEncrypt : DataEncryptService,
   )
  {

  if(localStorage.getItem('user')){
  const loginusers:any = localStorage.getItem('user');

  this.user = this.DataEncrypt.decryptUserData(loginusers);
  }
  // this.all_cart()
  window.scrollTo(0, 0);

  // this.checkout_form = this.formBuilder.group({
  //       email:[this.user?.email, Validators.required],
  //       name: [this.user?.name, Validators.required],
  //       number: [this.user?.number, Validators.required],
  //       country: ['', Validators.required],
  //       city: ['', Validators.required],
  //       address: ['', Validators.required],
  //       zip_code: [''],
  //       product: ['', Validators.required],
  //       user_id: [ this.user.id , Validators.required],
  //       payment_method: ['', Validators.required],
  //       payment_status: ['Unpaid', Validators.required],
  //       sub_total: [this.totalPrice, Validators.required],
  //       total: [this.totalPrice, Validators.required],
  //       billing_status:[''],
  //       billing_email:['', Validators.required],
  //       billing_number: ['', Validators.required],
  //       billing_country: ['', Validators.required],
  //       billing_city: ['', Validators.required],
  //       billing_address: ['', Validators.required],
  //       billing_zip_code: [''],
  //       date:[''],
  //       delivery_status:[''],
  //       delivery_charges:['4'],
  //       cart_id: ['', Validators.required]




  // });






  }
  ngOnInit(): void {
    // Get the 'status' parameter from the URL

  }


  done = false;







  handleClick() {
    document.querySelectorAll('.truck-button').forEach(button => {
      button.addEventListener('click', e => {

          e.preventDefault();

          let box = button.querySelector('.box'),
              truck = button.querySelector('.truck');

          if(!button.classList.contains('done')) {

              if(!button.classList.contains('animation')) {

                  button.classList.add('animation');

                  gsap.to(button, {
                      '--box-s': 1,
                      '--box-o': 1,
                      duration: .3,
                      delay: .5
                  });

                  gsap.to(box, {
                      x: 0,
                      duration: .4,
                      delay: .7
                  });

                  gsap.to(button, {
                      '--hx': -5,
                      '--bx': 50,
                      duration: .18,
                      delay: .92
                  });

                  gsap.to(box, {
                      y: 0,
                      duration: .1,
                      delay: 1.15
                  });

                  gsap.set(button, {
                      '--truck-y': 0,
                      '--truck-y-n': -26
                  });

                  gsap.to(button, {
                      '--truck-y': 1,
                      '--truck-y-n': -25,
                      duration: .2,
                      delay: 1.25,
                      onComplete() {
                          gsap.timeline({
                              onComplete() {
                                  button.classList.add('done');
                              }
                          }).to(truck, {
                              x: 0,
                              duration: .4
                          }).to(truck, {
                              x: 40,
                              duration: 1
                          }).to(truck, {
                              x: 20,
                              duration: .6
                          }).to(truck, {
                              x: 96,
                              duration: .4
                          });
                          gsap.to(button, {
                              '--progress': 1,
                              duration: 2.4,
                              ease: "power2.in"
                          });
                      }
                  });

              }

          } else {
              button.classList.remove('animation', 'done');
              gsap.set(truck, {
                  x: 4
              });
              gsap.set(button, {
                  '--progress': 0,
                  '--hx': 0,
                  '--bx': 0,
                  '--box-s': .5,
                  '--box-o': 0,
                  '--truck-y': 0,
                  '--truck-y-n': -26
              });
              gsap.set(box, {
                  x: -24,
                  y: -6
              });
          }

      });
  });

  }

  resetHandleClick() {
    document.querySelectorAll('.truck-button').forEach(button => {
        // Reset button styles and classes
        button.classList.remove('animation', 'done');

        let box = button.querySelector('.box'),
            truck = button.querySelector('.truck');

        gsap.set(truck, {
            x: 4
        });
        gsap.set(button, {
            '--progress': 0,
            '--hx': 0,
            '--bx': 0,
            '--box-s': .5,
            '--box-o': 0,
            '--truck-y': 0,
            '--truck-y-n': -26
        });
        gsap.set(box, {
            x: -24,
            y: -6
        });
    });
}


  isLoading: boolean = false; // Add this property in your component

  confirmOrder() {
    this.handleClick();

    this.checkout_form.value.payment_method;
    this.loading = true;

    const products = this.cart_data.temp_order_list.map((item: any) => ({
      price: item.product.price,
      qty: item.qty,
      product_id: item.product.id,
      type:item.type,
      v_id:item.v_id

    }));

    const now = new Date();
    const currentDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const payload = {
      ...this.checkout_form.value,

      sub_total: this.totalPrice,
      total: this.totalPrice,

    };

    this.checkout_form.patchValue({
      product:products,
      sub_total:this.totalPrice,
      total:this.totalPrice,
      date: currentDateTime,
      cart_id: this.cart_data.id,

    })


    if(this.checkout_form.value.payment_method == 'online'){
      localStorage.setItem('dataa',JSON.stringify(this.checkout_form.value));
      this.router.navigate(['/payment']);
      return;
    }




    this.api.post('order/add', this.checkout_form.value).subscribe(
      (res: any) => {
        this.resetHandleClick();
        this.loading = false;
        console.log('Order confirmed:', res);
        this.mee = res;

        // Encrypt response
        const encryptedResponse = this.DataEncrypt.encryptUserData(res);

        // Navigate to Thank You page with encrypted data
        this.router.navigate(['/thanks'], { queryParams: { data: encryptedResponse } });
        this.isLoading = false; // Stop loading
      },
      (error: any) => {
        this.resetHandleClick();
        this.loading = false;

        console.error('Order confirmation failed:', error);
        this.errorMessage = 'Order confirmation failed. Please try again later.';
        this.isLoading = false; // Stop loading
      }
    );
  }


  // confirmOrder() {
  //   const products = this.cart_data.temp_order_list.map((item: any) => ({
  //     price: item.product.price,
  //     qty: item.qty,
  //     product_id: item.product.id
  //   }));

  //   const payload = {
  //     ...this.checkout_form.value,
  //     products: this.cart_data.id,
  //     sub_total: this.totalPrice,
  //     total: this.totalPrice
  //   };

  //   console.log(this.checkout_form.value);

  //   this.api.post('order/confirm', payload).subscribe(
  //     (res: any) => {
  //       console.log('Order confirmed:', res);

  //       // Encrypt response
  //       const encryptedResponse = this.DataEncrypt.encryptUserData(res);

  //       // Navigate to Thank You page with encrypted data
  //       this.router.navigate(['/thanks'], { queryParams: { data: encryptedResponse } });
  //     },
  //     (error: any) => {
  //       console.error('Order confirmation failed:', error);

  //       // Show error alert
  //       this.errorMessage = 'Order confirmation failed. Please try again later.';
  //     }
  //   );
  // }

  isAnimating = false;

  addRemoveClass() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 10000); // Duration of animation
    }
  }


  updatePaymentMethod(method: string) {
    this.checkout_form.patchValue({ payment_method: method });
  }

     all_cart() {
      this.loading = true;
      this.api.post('temp_order/all', { "customer_id" : this.user.id }).subscribe(
        (res: any) => {
          this.cart_data = res.data;
   this.calculateTotalPrice()

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
    calculateTotalPrice(): void {
      this.totalPrice = this.cart_data.temp_order_list.reduce((sum: number, item: { product: { price: number; }; qty: number; }) => {
        return sum + (item.product.price * item.qty );
      }, 0);

    }


    pp(a:any){

      if(a.v_id == null){
        return a.product.price
      }
      else{
        const result = a.product.variant.find((item:any) => item.id == a.v_id);
     return result.pirce

      }

    }

    var_name(v_id:any,pro:any){

      if(pro.variant.length > 0){

          const result = pro.variant.find((item:any) => item.id == v_id);
         return `( ${result.name} )`;
      }
      return;
        }

        totalPrices(cart:any){
          let final_pr: number = 0; // Initialize final price

      const updatedCart = cart?.temp_order_list.map((item:any) => {
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


      this.totalPrice = final_pr.toFixed(2)


        }


 open_payment_modal(payment_modal: any) {
  this.modalService.open(payment_modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'modal_booking' }).result.then((result) => {
    // Modal closed, open the second modal
 }, (reason) => {
    // Handle modal dismissal
});
  }


}
