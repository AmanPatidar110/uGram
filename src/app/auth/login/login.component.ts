import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubs: Subscription;

  constructor( private authService: AuthService) {}

  ngOnInit () {
    this.authStatusSubs = this.authService.getAuthStatusListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }


  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.userLogin(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
