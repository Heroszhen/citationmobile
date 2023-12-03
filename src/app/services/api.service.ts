import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IData, IDataCitation, IDataCitations, ILogin } from '../interfaces/general';
import { Citation } from '../models/citation';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends BaseService {

  constructor(private readonly http: HttpClient) { 
    super();
  }

  getCheckServer(): Observable<IData> {
    return this.http.get<IData>(`${this.baseUrl}/api/check-server`);
  }

  postLogin(data:object): Observable<ILogin> {
    return this.http.post<ILogin>(`${this.baseUrl}/api/login`, JSON.stringify(data), this.getHttpOptionsAuth());
  }

  getGetLoginProfile(): Observable<IData> {
    return this.http.get<IData>(`${this.baseUrl}/api/get-login-profile`, this.getHttpOptionsAuth());
  }

  getGetCitations(pageItem:number, keywords:string = ""): Observable<IDataCitations> {
    // let params = new HttpParams().set('page', pageItem);
    // params = params.set('keywords', keywords);

    // return this.http.get(`${this.baseUrl}/api/citations`, this.getHttpOptionsAuth(params));
    return this.http.get<IDataCitations>(`${this.baseUrl}/api/citations?page=${pageItem}&keywords=${keywords}`);
  }

  postEditCitation(data:FormData): Observable<IDataCitation> {
    return this.http.post<IDataCitation>(`${this.baseUrl}/api/citations/citation`,  data, this.getHttpOptionsAuth(null, true));
  }
}
