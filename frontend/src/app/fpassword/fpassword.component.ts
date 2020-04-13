import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-fpassword',
  templateUrl: './fpassword.component.html',
  styleUrls: ['./fpassword.component.css']
})
export class FpasswordComponent implements OnInit {

  otpForm : FormGroup;
  passwordForm : FormGroup;
  showPassword:boolean = false;

  otpSubmitted = false;
  passwordSubmitted = false;

  constructor(private router: Router, private userService : UserService, private fb : FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }


  get f() { return this.otpForm.controls; }
  get fa() { return this.passwordForm.controls; }


  createForm(){

    let group = {
      email: ['', Validators.required]

    }
    this.otpForm = this.fb.group(group);

    let fGroup = {
      otp: ['', Validators.required],
      password: ['', Validators.required]
    }

    this.passwordForm = this.fb.group(fGroup);

  }



  onSubmit(){
    this.otpSubmitted = true;
    if (this.otpForm.invalid) {
      return;
    }

    let tmpdata = {};
    tmpdata["email"] = this.otpForm.value["email"];

    this.userService.generateOtp(tmpdata).subscribe((res)=>{
      if(res["status"] == "success"){
        alert("Otp generated, please check your email");
        this.showPassword = true;
        // this.otpForm.reset();

      }else{
        alert("Invalid email");
      }
    },(error)=>{
      alert(JSON.stringify(error));
    })
    
    
  }



  onSubmitP(){
    this.passwordSubmitted = true;
    if (this.passwordForm.invalid) {
      return;
    }

  
    this.userService.updatePasswordOtp(this.passwordForm.value).subscribe((res)=>{
      if(res["status"] == "success"){
        alert("Password changes");
        this.router.navigateByUrl("/login");

      }else{
        alert("Invalid Credentials");
      }
    },(error)=>{
      alert(JSON.stringify(error));
    })
    
    
  }






}
