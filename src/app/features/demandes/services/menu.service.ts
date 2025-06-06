import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from "../../../service/authenticationService";
import { AppConfigService } from "src/app/app-config.service";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private appConfig: AppConfigService
  ) {
    this.apiUrl = this.appConfig.getConfig().baseUrl;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  // Fetch full menu (includes submenus)
  getMenu(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menuuser/`, {
      headers: this.getHeaders(),
    });
  }
}
