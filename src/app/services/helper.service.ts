import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, ReplaySubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private token = null;
  context = null;
  insertedData = null;
  constructor(private http: HttpClient) { }

  set appToken(token) {
    this.token = token;
    if ( this.token ) {
      localStorage.setItem('appToken', token);
    } else {
      localStorage.removeItem('appToken'); 
    }
  }

  get appToken() {
    if (this.token) {
      return this.token;
    } else if (localStorage.getItem('appToken')) {
      this.token = localStorage.getItem('appToken');
      return this.token;
    } else {
      return null;
    }
  }

  login(data: { email: string, password: string}) {
    return this.http.post(`${environment.url}/api/login`, data);
  }

  getUsers() {
    return this.http.get(`${environment.url}/api/users?page=2`);
  }

  getContext(): Subject<any>{
    const contextSubject = new ReplaySubject();
    if (this.context) {
      contextSubject.next(this.context);
    } else {
      Word.run( async context => { 
        this.context = context;
        contextSubject.next(this.context);
      });
    }
    return contextSubject;
  }

  insertData(data){
    this.getContext().subscribe( async context => {
      let documentLocation = context.document.getSelection();
      if (this.insertedData) {
        this.insertedData.load();
        this.insertedData.paragraphs.load();
        this.insertedData.inlinePictures.load();
        context.document.body.paragraphs.load()
        await context.sync();
        for (const item of this.insertedData.inlinePictures.items) {
          item.delete();
        }
        for (const item of context.document.body.paragraphs.items) {
          item.load();
        }
        await context.sync();
        for (const item of context.document.body.paragraphs.items) {
          const validate = ['First Name: ', 'Last Name: ', 'Email: '];
          if(validate.find(i => item.text.indexOf(i)>=0)) {
            item.delete();
          }
        }
        await context.sync();
        documentLocation = this.insertedData;
      }
      const htmlString = `<img src="${data.avatar}" alt="User Pic">
      <p>First Name: ${data.first_name}</p>
      <p>Last Name: ${data.last_name}</p>
      <p>Email: ${data.email}</p>
      `;
      this.insertedData = documentLocation.insertHtml(
        htmlString,
        Word.InsertLocation.after
      );
      this.insertedData.select('End');
      
      context.trackedObjects.add(this.insertedData);
      await context.sync();
    });
  }

  checkContent(data) {
    return new Promise( (resolve) => {
      this.getContext().subscribe( async context => {
        if (this.insertedData) {
          this.insertedData.load();
          this.insertedData.paragraphs.load();
          this.insertedData.inlinePictures.load();
          context.document.body.paragraphs.load();
          await context.sync();
          const paragraphs = this.insertedData.paragraphs.items;
          for (const item of this.insertedData.inlinePictures.items) {
            item.load();
          }
          for (const item of context.document.body.paragraphs.items) {
            item.load();
          }
          await context.sync();
          const isFirstNameModified = paragraphs.find( item => this.checkData(item.text, data.first_name));
          const isLastNameModified = paragraphs.find( item =>this.checkData(item.text, data.last_name));
          const isEamilModified = paragraphs.find( item =>this.checkData(item.text, data.email));
          const result = {
            isPictureModified: this.insertedData.inlinePictures.items.length ? false : true,
            isFirstNameModified: isFirstNameModified ? false : true,
            isLastNameModified: isLastNameModified ? false : true,
            isEamilModified: isEamilModified ? false : true
          };
          resolve(result);
        }
      });
    });
  }

  checkData(item, value){
    if(!item){
      return false;
    } else {
      let data = item;
      if((item.indexOf(':') >= 0)) {
        data = item.split(':')[1];
      }
      if(data.trim().toLowerCase() === value.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    }
  }
}
