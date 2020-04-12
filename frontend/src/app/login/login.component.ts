import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  public loginForm : FormGroup;
  submitted = false;
  get f() { return this.loginForm.controls; }


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


  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    
    console.log(this.loginForm.value);
  }



}
