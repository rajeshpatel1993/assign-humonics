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

  currentBalance : Number ;
  passBookData: any;

  showDepositForm:boolean= false;
  showWithdrawForm: boolean = false;
  showBalanceDiv: boolean = false;
  showPassbook: boolean = false;

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
    tmpdata["transtype"] = "credit";

    this.userService.makeTransaction(tmpdata).subscribe((res)=>{
      if(res["status"] == "success"){
        alert("Credited");
        this.depositForm.reset();

      }else{
        alert("Invalid Transactions");
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

    let tmpdata = {};
    tmpdata["accountno"] = this.withdrawForm.value["acctNo"];
    tmpdata["amount"] = this.withdrawForm.value["amount"];
    tmpdata["transtype"] = "debit";


    this.userService.makeTransaction(tmpdata).subscribe((res)=>{
      if(res["status"] == "success"){
        this.withdrawForm.reset();
        alert("Debited");
      }else if(res["status"] == "lowbalance"){
        alert("not enough balance");
      }
      else{
        alert("Invalid Transaction");
      }
    },(error)=>{
      alert(JSON.stringify(error));
    })
    
    
  }

  loadBalances(acctno){
    this.userService.loadBalance(acctno).subscribe((d)=>{
      this.currentBalance = d['balance'];

    },(error)=>{
      console.log(error);
    });
  }


  loadPassbooks(acctno){
    this.userService.loadPassbooks(acctno).subscribe((d)=>{
      this.passBookData = d;

    },(error)=>{
      console.log(error);
    });
  }

  showDeposit(){
    this.showDepositForm = true;
    this.showWithdrawForm = false;
    this.showBalanceDiv = false;
    this.showPassbook = false;

  }

  showWithdraw(){
    this.showDepositForm = false;
    this.showWithdrawForm = true;
    this.showBalanceDiv = false;
    this.showPassbook = false;

  }


  showBallances(){
    this.showDepositForm = false;
    this.showWithdrawForm = false;
    this.showBalanceDiv = true;
    this.showPassbook = false;
    this.loadBalances(this.acctNo);

  }

  showPassbooks(){
    this.showDepositForm = false;
    this.showWithdrawForm = false;
    this.showBalanceDiv = false;
    this.showPassbook = true;
    this.loadPassbooks(this.acctNo);

  }






}
