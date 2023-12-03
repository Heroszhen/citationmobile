import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  protected httpOptions = {};
  protected httpOptionsAuth: object = {};
  protected baseUrl: string = '';

  constructor() { 
    this.baseUrl = environment.baseUrl;

    this.refreshHttpOptions();
  }

  refreshHttpOptions() {
    this.httpOptionsAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      })
    };

    this.httpOptions = {
      headers: new HttpHeaders({})
    };
  }

  getHttpOptionsAuth(options:object|null = null, isFormData:boolean = false): object {
    let headers:HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'X-Requested-With': 'XMLHttpRequest',
      'ngsw-bypass': '',
    })
    if (!isFormData)headers = headers.set('Content-Type', 'application/json');
    console.log(headers)

    this.httpOptionsAuth = {
      headers: headers
    };

    if (options !== null)this.httpOptionsAuth = {...this.httpOptionsAuth, ...options};

    return this.httpOptionsAuth;
  }
}
