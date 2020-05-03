import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users = [];
  errors = [];
  success = [];
  dataModified: any = {
    picture: null,
    firstName: null,
    lastName: null,
    email: null
  }
  selected = null;
  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this.helperService.getUsers().subscribe( (res: any) => {
      this.users = res.data;
    });
  }

  onRowSelect(user) {
    this.selected = user;
    this.errors = [];
    this.success = [];
    this.dataModified = {};
    this.helperService.insertData(user);
  }

  checkData(){
    this.errors = [];
    this.success = [];
    this.helperService.checkContent(this.selected).then((data: any) => {
      const { isPictureModified, isFirstNameModified, isLastNameModified, isEamilModified} = data;
      if (isPictureModified) {
        this.dataModified.picture =  'Picture is deleted from document';
        this.errors.push(this.dataModified.picture);
      } else if (this.dataModified.picture) {
        this.dataModified.picture =  null;
        this.success.push('Picture is restored');
      }
      if (isFirstNameModified) {
        this.dataModified.firstName =  'First Name is modified';
        this.errors.push(this.dataModified.firstName);
      } else if (this.dataModified.firstName) {
        this.dataModified.firstName = null;
        this.success.push('First Name is corrected');
      }
      if (isLastNameModified) {
        this.dataModified.lastName =  'Last Name is modified';
        this.errors.push(this.dataModified.lastName);
      } else if (this.dataModified.lastName) {
        this.dataModified.lastName = null;
        this.success.push('Last Name is corrected');
      }
      if (isEamilModified) {
        this.dataModified.email =  'Email is modified';
        this.errors.push(this.dataModified.email);
      } else if (this.dataModified.email) {
        this.dataModified.email = null;
        this.success.push('Email is corrected');
      }
    });
  }

}
