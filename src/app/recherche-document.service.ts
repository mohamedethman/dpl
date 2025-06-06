import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "./service/authenticationService";
import { AppConfigService } from "./app-config.service"; // adjust path if needed

@Injectable({
  providedIn: "root",
})
export class RechercheDocumentService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private appConfig: AppConfigService
  ) {
    this.apiUrl = this.appConfig.getConfig().baseUrl; // or whatever your key is in parameters.json
  }

  searchDocuments(params: any): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post(`${this.apiUrl}/rechercheDocs`, params, { headers })
      .pipe(
        catchError((error) => {
          console.error("Error searching documents:", error);
          return of({ data: [], totalElements: 0 });
        })
      );
  }

  getAllLaboratoires(): Observable<any[]> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<any[]>(`${this.apiUrl}/listLaboratoires`, { headers })
      .pipe(
        catchError((error) => {
          console.error("Error loading laboratoires:", error);
          return of([]);
        })
      );
  }

  downloadDocument(documentId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get(`${this.apiUrl}/documents/${documentId}/download`, {
        headers,
        responseType: "blob",
      })
      .pipe(
        catchError((error) => {
          console.error("Error downloading document:", error);
          return of(null);
        })
      );
  }
}
