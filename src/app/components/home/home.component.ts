import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
 import { RequestService } from '../../../app/services/request.service';
 import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  categories = [
    { name: "Headphones", products: 3, image: "  ../../../assets/images/author-2.jpg" },
    { name: "Mobile Tablets", products: 3, image: "  ../../../assets/images/author-2.jpg" },
    { name: "CPU Heat Pipes", products: 2, image: "  ../../../assets/images/author-2.jpg" },
    { name: "Smart Watch", products: 3, image: "  ../../../assets/images/author-2.jpg" },
    { name: "Bluetooth", products: 2, image: "  ../../../assets/images/author-2.jpg" }
  ];


  user: any;
  product_data: any;
  loading: boolean = false;
  cate_gory_data: any;
  brand_data: any;
  firstThreeProducts: any;
  currentImageIndex: number[] = []; // To track the current image index for each product
  imageChangeInterval: any; // Store the interval
  popular_products: any;
  popularProducts: any[] = [];
  currentProductIndex = 0;
  rotationSubscription: Subscription | undefined;
  previousProductIndex = 0;
  media_data: any;
  currentIndex = 0;
  slidesPerPage = 4; // Default to 5 slides per page for larger screens
  totalSlides = 9;
  event:any;
  select_product_notify: any;
  pop_up : boolean  = false
  banner_img: any;
  currentUrl: string;
  topseell:any
  product_data_forslider: any;
  constructor(private formBuilder: FormBuilder ,    private modalService: NgbModal
 ,    private router: Router,private api: RequestService,private DataEncrypt : DataEncryptService) {
    if(localStorage.getItem('user')){
    const loginusers:any = localStorage.getItem('user');

    this.user = this.DataEncrypt.decryptUserData(loginusers);
    }
    window.scrollTo(0, 0);


    this.imageChangeIntervals_fpop.forEach(interval => clearInterval(interval));

    this.currentUrl = this.router.url;


    this.all_product()
    this.all_brands()
    this.all_category()
    this.fetchPopularProducts()
    this.media();
    this.all();
    this.banner()
 


  }
  ngOnInit() {
    this.startSlideShow();

  }
  
  imageChangeIntervals_fpop: any[] = []; // Array to hold intervals for each product
  currentImageIndex_fpop: number[] = [];
  all_product() {
    //   ;
    this.api.post('product/all', true).subscribe(
      (res: any) => {
        this.product_data = res.data;
        this.product_data_forslider = res.data.data;

        this.firstThreeProducts = this.product_data.data.slice(0, 3);
        this.popular_products = this.product_data.data.slice(0,6 );
        this.topseell = this.product_data.data.slice(0, 8);

        // Initialize the current image index for each product
        this.firstThreeProducts.forEach(() => {
          this.currentImageIndex.push(0); // Start each product's image at index 0
        });
        this.popular_products.forEach((product: { product_image: any; }, index: any    ) => {
          this.currentImageIndex_fpop[index] = 0; // Start at index 0
          this.startImageChange_for_po_pro(index, product.product_image);
        });

        // Start the image change interval
        this.startImageChange();
        // this.loading = false;
      },
      (error: any) => {
        // this.loading = false;
        if (error.status === 400) {
          // Handle error for invalid response
        } else {
          // Handle generic error
        }
      }
    );
  }
  fetchPopularProducts(): void {
    this.api.post('product/all', true).subscribe((res: any) => {
      this.popularProducts = res.data.data.slice(0, 5);
      this.startProductRotation();
    });
  }                   

  startProductRotation(): void {
    this.rotationSubscription = interval(5000).subscribe(() => {
      this.previousProductIndex = this.currentProductIndex;
      this.currentProductIndex = (this.currentProductIndex + 1) % this.popularProducts.length;
    });
  }

  ngOnDestroy(): void {
    if (this.rotationSubscription) {
      this.rotationSubscription.unsubscribe();
    }
  }

  getAnimationClass(index: number): string {
    if (index === this.currentProductIndex) return 'animate-in';
    if (index === this.previousProductIndex) return 'animate-out';
    return '';
  }

  selectProduct(index: number): void {
    this.previousProductIndex = this.currentProductIndex;
    this.currentProductIndex = index;
  }
  
























  
  startImageChange_for_po_pro(productIndex: number, images: any[]) {
    const interval = setInterval(() => {
      this.currentImageIndex_fpop[productIndex] = (this.currentImageIndex_fpop[productIndex] + 1) % images.length;
    }, 5000); // Change image every 5 seconds
    this.imageChangeIntervals_fpop[productIndex] = interval; // Store the interval
  }
  startImageChange() {
    this.imageChangeInterval = setInterval(() => {
      this.firstThreeProducts.forEach((product: { product_image: string | any[]; }, index: any | number) => {
        const totalImages = product.product_image.length;
        this.currentImageIndex[index] = (this.currentImageIndex[index] + 1) % totalImages;
      });
    }, 5000); // Change image every 1 second
  }

  
 
  all_category() {


      //   ;
      this.api.post('category/all',true).subscribe((res: any) => {
      this.cate_gory_data = res.data
          // this.loading = false;
         this.totalSlides = res.data?.length


        },
        (error: any) => {
          // this.loading = false;
          if(error.status == 400){
            // this.showDanger('Invalid Username or Password');
          }else{
            // this.showDanger('There is some error');
          }
        }
      );
  }


  encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }



  all_brands() {


     this.api.post('brand/all',true).subscribe((res: any) => {
    this.brand_data = res.data
        this.loading = false;


      },
      (error: any) => {
         if(error.status == 400){
          // this.showDanger('Invalid Username or Password');
        }else{
          // this.showDanger('There is some error');
        }
      }
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.updateSlidesPerPage();
  }

  updateSlidesPerPage() {
    const width = window.innerWidth;

    // Change the number of slides visible based on the screen size
    if (width >= 1200) { // Large screens (Desktop)
      this.slidesPerPage = 5;
    } else if (width >= 992) { // Medium screens (Tablets)
      this.slidesPerPage = 2;
    } else { // Small screens (Mobile)
      this.slidesPerPage = 1;
    }
  }

  nextSlide() {
    if (this.currentIndex + this.slidesPerPage < this.totalSlides) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;  // Loop back to the first slide
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.totalSlides - 1;  // Go to the last slide if we are at the first one
    }
  }

  // Function for handling category click
  // onCategoryClick(item: any) {
  //   console.log("Category clicked: ", item);
  //   // Add any functionality you want when a category is clicked
  // }




  truncateText(text: string, wordLimit: number): string {
    if (!text) return '';

    const wordsArray = text.split(' ');  // Split text by spaces
    if (wordsArray.length > wordLimit) {
      return wordsArray.slice(0, wordLimit).join(' ') + '...';  // Join the first 'wordLimit' words and add '...'
    }

    return text;  // Return the original text if it's within the limit
  }




  oneventClicka(item: any) {
 
       const encryptedId = this.DataEncrypt.encryptUserData(item.id);

    // Navigate with the ID as a query parameter
    this.router.navigate(['/event_read'], { queryParams: { page: encryptedId } }); 

  }
  onCategoryClick(item: any) {
    const user = localStorage.getItem('user');

       const encryptedId = this.DataEncrypt.encryptUserData(item.id);

    // Navigate with the ID as a query parameter
    this.router.navigate(['/Pro'], { queryParams: { page: encryptedId } });       

  }

  get_product_detail(item: any) {
    // Check if user is present in local storage
    const user = localStorage.getItem('user');
    const encryptedId = this.DataEncrypt.encryptUserData(item.id);
    this.router.navigate(['/Products_Views'], { queryParams: { page: encryptedId } });
    // if (user) {
    //   // User exists, proceed with product detail navigation
    //   const encryptedId = this.DataEncrypt.encryptUserData(item.id);

    //   // Navigate with the ID as a query parameter
    //   this.router.navigate(['/Products_Views'], { queryParams: { page: encryptedId } });
    // } else {
    //   // User not found, redirect to login with a query parameter
    //   this.router.navigate(['/Login'], { queryParams: { redirect: '/Products_Views', page: item.id } });
    // }
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

  media(){
    this.loading =true
  this.api.post('media/all', true).subscribe(
    (res: any) => {
      this.media_data = res.data
this.loading = false
    })

  }


  banner(){
    this.loading = true
    this.api.post(`event/banner`,{type: 3}).subscribe((res: any) => {
      this.banner_img = res.data;
      console.log(this.banner_img)
      this.loading = false
    })
  }
  all(){
    this.loading = true
    this.api.post(`event/workshops`,true).subscribe((res: any) => {
      this.event = res.data;
      this.loading = false
    })
  }
  isUpcoming(eventDate: string): boolean {
    const today = new Date();
    const event = new Date(eventDate);
    return event > today;
  }
  oneventClick(item: any) {
 
    const encryptedId = this.DataEncrypt.encryptUserData(item.id);

 // Navigate with the ID as a query parameter
 this.router.navigate(['/event_read'], { queryParams: { page: encryptedId } });   

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
      this.event = res.data;
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
          this.event = res.data;
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




currentSlideIndex: number = 0;
  slides = [
    {
      title: 'Title 1',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, necessitatibus.',
      image: 'https://images.unsplash.com/photo-1682685796063-d2604827f7b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
    },
    {
      title: 'Title 2',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, necessitatibus.',
      image: 'https://images.unsplash.com/photo-1682687220566-5599dbbebf11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1075&q=80'
    },
    {
      title: 'Title 3',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, necessitatibus.',
      image: 'https://images.unsplash.com/photo-1682685797828-d3b2561deef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
    }
  ];

  private slideInterval: any; 
  ngOnDestrosy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Change to the next slide
  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlides();
    }, 5000); // Change slide every 5 seconds
  }

  nextSlides() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  currentSlide(index: number) {
    this.currentSlideIndex = index;
  }
}
