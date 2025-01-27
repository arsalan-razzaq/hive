import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DataEncryptService {

  constructor() { }

encryptUserData(user: any): string {
    const encryptedData = AES.encrypt(JSON.stringify(user), 'encryption-secret-key').toString();
    return encryptedData;
  }
decryptUserData(encryptedData: string): any {
  const decryptedBytes = AES.decrypt(encryptedData, 'encryption-secret-key');
  const decryptedData = JSON.parse(decryptedBytes.toString(enc.Utf8));
  return decryptedData;
}

}
