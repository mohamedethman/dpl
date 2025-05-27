import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../service/authenticationService';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Fetch full menu (includes submenus)
  getMenu(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menuuser/`, { headers: this.getHeaders() });
  }
}
