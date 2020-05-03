import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isLoggedIn = false;
  constructor(private helperService: HelperService, private router: Router) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.helperService.appToken ? true : false;
  }

  logout() {
    this.helperService.appToken = null;
    this.router.navigate(['login']);
  }
}
