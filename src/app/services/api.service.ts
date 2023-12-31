import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IData, IDataCitation, IDataCitations, IDataComment, IDataComments, ILogin } from '../interfaces/general';
import { Citation } from '../models/citation';
import { Comment } from '../models/comment';

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

  getGetCitation(id:string): Observable<IDataCitation> {
    return this.http.get<IDataCitation>(`${this.baseUrl}/api/citations/citation/${id}`, this.getHttpOptionsAuth());
  }

  getGetCommentsByCitation(citationId:string, pageItem:number): Observable<IDataComments> {
    return this.http.get<IDataComments>(`${this.baseUrl}/api/citations/citation/${citationId}/comments?page=${pageItem}`, this.getHttpOptionsAuth());
  }

  postEditComment(citationId:string, comment:Comment): Observable<IDataComment> {
    return this.http.post<IDataComment>(`${this.baseUrl}/api/citations/citation/${citationId}/comment`, JSON.stringify(comment), this.getHttpOptionsAuth());
  }
  deleteDeleteComment(commentId:string): Observable<IData> {
    return this.http.delete<IData>(`${this.baseUrl}/api/comment/${commentId}`, this.getHttpOptionsAuth());
  }
}
