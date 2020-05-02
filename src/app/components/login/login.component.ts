import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string = null;
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private helperService: HelperService, private router: Router) { }

  ngOnInit(): void {
  }
  submit() {
    if (this.form.valid) {
      this.error = null;
      this.helperService.login(this.form.value).subscribe( (res: { token: string}) => {
        if (res.token) {
          this.helperService.appToken = res.token;
          this.router.navigate(['/users']);
        }
      }, (res: any) => {
        if (res.error) {
          this.error = res.error.error;
        }
      });
    }
  }
}
