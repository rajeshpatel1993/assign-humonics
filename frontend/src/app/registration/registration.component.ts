import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public registrationForm : FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) { }
  submitted = false;
  ngOnInit() {
    this.createForm();
  }


  get f() { return this.registrationForm.controls; }

  createForm() {
    let group = {
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required]

    }
    this.registrationForm = this.fb.group(group);
  }


  onSubmit(){
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }

    this.userService.addUser(this.registrationForm.value).subscribe((res)=>{
      alert("Registration successful");
    },(error)=>{
      console.log(error);
    });
    console.log(this.registrationForm.value);
  }


}
