import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService {
  private apiUrl = 'https://api.beispiel.de/submit';

  constructor(private http: HttpClient) {}

  submitFormData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
