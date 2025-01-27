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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  loading : boolean = false
  categoryId: any;
  product_data: any;
  popular_products: any;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder , private router: Router,private api: RequestService,private DataEncrypt : DataEncryptService) {
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

     this.all_product()
  }



  all_product() {
    this.loading = true;
    this.api.post('product/all', { "id" : this.categoryId }).subscribe(
      (res: any) => {
        this.product_data = res.data.data;
        
        this.popular_products = this.product_data

        
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        if (error.status === 400) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      }
    );
  }




  get_product_detail(item: any) {
    const encryptedId = this.DataEncrypt.encryptUserData(item.id);

    // Navigate with the ID as a query parameter
    this.router.navigate(['/Products_Views'], { queryParams: { page: encryptedId } });  
  }
 
}
