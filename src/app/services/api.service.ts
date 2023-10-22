import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogin } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends BaseService {

  constructor(private readonly http: HttpClient) { 
    super();
  }

  postLogin(data:object): Observable<ILogin> {
    return this.http.post<ILogin>(`${this.baseUrl}/api/login`, JSON.stringify(data), this.getHttpOptionsAuth());
  }
}
