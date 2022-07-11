import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {

  constructor(private http: HttpClient) { }

  public getContactList(pageIndex: number, pageSize: number, searchName: string) {
    let httpParams = new HttpParams().set('limit', pageSize)
      .set('page', pageIndex)
      .set('name', searchName);
    const options = { params: httpParams }
    return this.http.get<Contact[]>('http://localhost:8080/contacts', options);
  }

  public getContactCount() {
    return this.http.get<number>('http://localhost:8080/contacts/count');
  }
}
