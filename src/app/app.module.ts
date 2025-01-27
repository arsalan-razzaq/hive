import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 import { FormsModule } from '@angular/forms';

   import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContatcComponent } from './components/contatc/contatc.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ThanksComponent } from './components/thanks/thanks.component';
import { AccountsComponent } from './components/accounts/accounts.component';

import { DeliveryPolicyComponent } from './components/delivery-policy/delivery-policy.component';
import { PaymentPolicyComponent } from './components/payment-policy/payment-policy.component';
import { PrivacyPolixyComponent } from './components/privacy-polixy/privacy-polixy.component';
import { TermsPolixyComponent } from './components/terms-polixy/terms-polixy.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';

// import { HttpLoaderFactory } from './app-translate-loader'; // adjust the path as needed

const firebaseConfig = {
  apiKey: "AIzaSyBmAQYIbA3tr2VCsMC_5hveW5-DYM3kRdU",
  authDomain: "demo1-22a88.firebaseapp.com",
  projectId: "demo1-22a88",
  storageBucket: "demo1-22a88.appspot.com",
  messagingSenderId: "934277004790",
  appId: "1:934277004790:web:0d48544bbb76a533afdbd7",
  measurementId: "G-H8VNHR8MBP"
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ContatcComponent,
    ProductsComponent,
    ProductDetailComponent,
    ProductViewComponent,
    ProductComponent,
    CartComponent,
    CheckOutComponent,
    LoginComponent,
    SignupComponent,
    ThanksComponent,
    AccountsComponent,

    DeliveryPolicyComponent,
    PaymentPolicyComponent,
    PrivacyPolixyComponent,
    TermsPolixyComponent,
    RefundPolicyComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
     FormsModule,
    CommonModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
   ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
