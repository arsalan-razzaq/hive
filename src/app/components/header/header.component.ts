import { Component, EventEmitter, HostListener, Output } from '@angular/core';
 import { RequestService } from '../../../app/services/request.service';
 import { AES } from 'crypto-js';
import { FormBuilder, Validators } from '@angular/forms';
import { DataEncryptService } from '../../../app/services/data-encrypt.service';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('200ms ease-out')),
    ]),
  ],
})
export class HeaderComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 100;
  }
  isDropdownOpen: { [key: string]: boolean } = {
    home: false,
    shop: false,
    pages: false,
    blog: false
  };
  toggleDropdown(menu: string): void {
    // Toggle the clicked dropdown's visibility
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  }

  showDropdown: boolean = false;
  totalPrice: any;
  cart_data: any;
  tempOrderCount: any;

  limitedCategories:any;
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.category-shop-item');

    // Check if the click is outside the dropdown or the button
    if (dropdown && !dropdown.contains(target) && !target.closest('.header-category-toggle-btn')) {
      this.showDropdown = false;
    }
  }

  user: any;
  product_data: any;
  loading: boolean = false;
  cate_gory_data: any = [];
  brand_data: any;
  userName: any  = 'User';  // This is the user's name variable
  phoneNumber: string = '971509350666'; // Your phone number
  constructor(private formBuilder: FormBuilder,private api: RequestService,private DataEncrypt : DataEncryptService , private router: Router) {
    if(localStorage.getItem('user')){
    const loginusers:any = localStorage.getItem('user');

    this.user = this.DataEncrypt.decryptUserData(loginusers);
    this.userName = this.user?.name
    console.log(this.user)
    }





    this.all_product()
    this.all_brands()
    this.all_category()
    this.all_cart()

  }
  all_cart() {
    //  ;
    this.api.post('temp_order/all', { "customer_id" : this.user?.id }).subscribe(
      (res: any) => {
        this.cart_data = res.data;
        this.tempOrderCount = res.data?.temp_order_list?.length; // Store the count of temp_order_list items

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
    this.totalPrice = this.cart_data?.temp_order_list?.reduce((sum: number, item: { product: { price: number; }; qty: number; }) => {
      return sum + (item.product.price * item.qty);
    }, 0);
    console.log (this.totalPrice)
  }



  all_product() {


    //  ;
    this.api.post('product/all',true).subscribe((res: any) => {
    this.product_data = res.data
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

  all_category() {


      //  ;
      this.api.post('category/all',true).subscribe((res: any) => {
      this.cate_gory_data = res.data
      this.limitedCategories = this.cate_gory_data.slice(0, 5);
      const a = JSON.stringify(res.data);
      localStorage.setItem('catlog',a)
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


  encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }

  isMegaMenuActive: boolean = false;

  toggleMegaMenu(): void {
    this.isMegaMenuActive = !this.isMegaMenuActive;
  }

  closeMegaMenu(): void {
    this.isMegaMenuActive = false;
  }

  all_brands() {


    //  ;
    this.api.post('brand/all',true).subscribe((res: any) => {
    this.brand_data = res.data
    const a = JSON.stringify(res.data);
    localStorage.setItem('brands',a)
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

  onCategoryClick(item: any) {
    const user = localStorage.getItem('user');


      const encryptedId = this.DataEncrypt.encryptUserData(item.id);

    // Navigate with the ID as a query parameter
    this.router.navigate(['/Pro'], { queryParams: { page: encryptedId } });

  }



  isMenuOpen = false;

  toggleMenu(event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    const button = document.querySelector('.open-btn') as HTMLElement;

    // Check if the click is outside the menu and not on the toggle button
    if (this.isMenuOpen && !target.closest('.mobileMenu') && !button.contains(target)) {
      this.isMenuOpen = false;
    }
  }

  submenuOpen: boolean = false;

  toggleSubmenu() {
    this.isMenuOpen = true; // Open the main menu when submenu is toggled
    this.submenuOpen = !this.submenuOpen; // Toggle the submenu visibility
  }
  // In your component.ts file
isHovered: boolean = false;
isMenuVisible: boolean = false

onMouseEnter() {
  this.isHovered = true;
}

onMouseLeave() {
  this.isHovered = false;
}
onHover(isHovering: boolean) {
  this.isMenuVisible = isHovering;
}

dropdownVisible_user = false;


toggleDropdown_user() {
  this.dropdownVisible_user = !this.dropdownVisible_user;
}
@HostListener('document:click', ['$event'])
closeDropdown(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-profile') && !target.closest('.dropdown-menu')) {
    this.dropdownVisible_user = false;
  }
}
}
