import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private userService : UserService, private router : Router) { }
  public loginForm : FormGroup;
  submitted = false;
  


  ngOnInit() {
    this.createForm();
  }


  createForm() {
    let group = {
      email: ['', Validators.required],
      password: ['', Validators.required],

    }
    this.loginForm = this.fb.group(group);
  }

  get f() { return this.loginForm.controls; }
  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.userService.login(this.loginForm.value).subscribe((res)=>{
      if(res["status"] == "success"){
        localStorage.setItem("token",res["token"]);
        localStorage.setItem("email",res["email"]);
        this.router.navigateByUrl("/home");
      }else{
        alert("Invalid Credentials");
      }
    },(error)=>{
      alert(JSON.stringify(error));
    })
    
    
  }



}
