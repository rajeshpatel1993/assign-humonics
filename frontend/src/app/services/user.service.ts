import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  public baseUrl = environment.baseUrl;

  addUser(userdata){
    return this.http.post(this.baseUrl+"/user/register",userdata);
  }

  login(userdata){
    return this.http.post(this.baseUrl+"/user/login",userdata);
  }

  loadAcctNo(emaildata){
    return this.http.post(this.baseUrl+"/user/acctno",emaildata);
  }

  makeTransaction(transactionData){
    return this.http.post(this.baseUrl+"/user/maketransaction",transactionData);
  }

  loadBalance(acctno){
    return this.http.get(this.baseUrl+"/user/getBallances/"+acctno);
  }

  loadPassbooks(acctno){
    return this.http.get(this.baseUrl+"/user/getPassbook/"+acctno);
  }

  generateOtp(emaildata){
    return this.http.post(this.baseUrl+"/user/generateOtp",emaildata);
  }

  updatePasswordOtp(userdata){
    return this.http.post(this.baseUrl+"/user/changePasswordOtp",userdata);
  }
}
