import { Component } from '@angular/core';
import { AES, enc } from 'crypto-js';
         
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'staybook';
  isLoggedIn(): boolean {
    const bearerToken = localStorage.getItem('bearer_token');
    const authantication = localStorage.getItem('authantication');
    if (bearerToken && authantication) {
      const decryptedUser = this.decryptUserData(authantication);
      if (decryptedUser == 'approved') {
        return true;
      }else{
        return false;
      }
    }
    return false;
  }
  decryptUserData(encryptedData: string): any {
    const decryptedBytes = AES.decrypt(encryptedData, 'encryption-secret-key');
    const decryptedData = JSON.parse(decryptedBytes.toString(enc.Utf8));
    return decryptedData;
  }
}
