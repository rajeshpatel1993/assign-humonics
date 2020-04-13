import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private userService : UserService, private fb : FormBuilder) { }
  public acctNo:any = "";
  depositSubmitted = false;
  withdrawSubmitted = false;
  depositForm : FormGroup;
  withdrawForm : FormGroup;
  showForms:boolean = false;
  ngOnInit() {
    this.loadAccountNo();
  

  }


  get f() { return this.depositForm.controls; }
  get fa() { return this.withdrawForm.controls; }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  loadAccountNo(){
    let email = localStorage.getItem("email");
    this.userService.loadAcctNo({"email":email}).subscribe((res)=>{
      this.acctNo = res["acctno"];
      this.createForm(this.acctNo);
      this.showForms = true;
    },(error)=>{console.log(error)});

  }

  createForm(acctNo){
    console.log(acctNo);
    let group = {
      acctNo: [acctNo, Validators.required],
      amount: ['', Validators.required],

    }
    this.depositForm = this.fb.group(group);

    this.withdrawForm = this.fb.group(group);



  }


  onDeposit(){
    this.depositSubmitted = true;
    if (this.depositForm.invalid) {
      return;
    }

    let tmpdata = {};
    tmpdata["accountno"] = this.depositForm.value["acctNo"];
    tmpdata["amount"] = this.depositForm.value["amount"];
    tmpdata["transtype"] = "deposit";

    this.userService.makeTransaction(tmpdata).subscribe((res)=>{
      if(res["status"] == "success"){
        
      }else{
        alert("Invalid Credentials");
      }
    },(error)=>{
      alert(JSON.stringify(error));
    })
    
    
  }


  onWithdraw(){
    this.withdrawSubmitted = true;
    if (this.withdrawForm.invalid) {
      return;
    }

    this.userService.login(this.depositForm.value).subscribe((res)=>{
      if(res["status"] == "success"){
        
      }else{
        alert("Invalid Credentials");
      }
    },(error)=>{
      alert(JSON.stringify(error));
    })
    
    
  }


}
