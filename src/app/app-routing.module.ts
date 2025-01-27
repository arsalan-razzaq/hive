import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContatcComponent } from './components/contatc/contatc.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ThanksComponent } from './components/thanks/thanks.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { DeliveryPolicyComponent } from './components/delivery-policy/delivery-policy.component';
import { PaymentPolicyComponent } from './components/payment-policy/payment-policy.component';
import { PrivacyPolixyComponent } from './components/privacy-polixy/privacy-polixy.component';


const routes: Routes = [
  {path:'', component:HomeComponent , title:'Painting '},
  {path:'Contact', component:ContatcComponent , title:'Painting  Contact '},
  {path:'Products', component:ProductsComponent , title:'Painting  Products '},
  {path:'Products_Views', component:ProductViewComponent , title:'Painting  Products '},
  {path:'Pro', component:ProductComponent , title:'Painting  Products '},
  {path:'Cart', component:CartComponent , title:'Painting Cart '},
  {path:'Checkout', component:CheckOutComponent , title:'Painting Checkout '},
  {path:'Login', component:LoginComponent , title:'Painting Login '},
  {path:'Signup', component:SignupComponent , title:'Painting Signup '},
  {path:'Thanks', component:ThanksComponent , title:'Painting Order Placed '},
  {path:'Orders', component:AccountsComponent , title:'Painting Orders '},

  {path:'Delivery_policy', component:DeliveryPolicyComponent , title:'Painting Delivery Policy  '},
  {path:'Payment_policy', component:PaymentPolicyComponent , title:'Painting Payment Policy  '},
  {path:'Privacy_policy', component:PrivacyPolixyComponent , title:'Painting Privacy Policy  '},



];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
