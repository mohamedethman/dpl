// recherche-document.service.ts
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AuthenticationService } from "../../../service/authenticationService";
import { environment } from "../../../../environments/environment";
import { RechercheDocumentResponse } from "../../demandes/models/recherche-document";

interface RechercheDocumentRequest {
  typeDocument: string;
  id?: number;
  page?: number;
  size?: number;
}
@Injectable({
  providedIn: "root",
})
export class RechercheDocumentService {
  private apiUrl = `${environment.baseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  // recherche-document.service.ts
  // recherche-document.service.ts
  searchDocuments(
    request: RechercheDocumentRequest
  ): Observable<RechercheDocumentResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    // Add pagination parameters to the request
    const params = new HttpParams()
      .set("page", request.page.toString())
      .set("size", request.size.toString());

    console.log("Request Params:", params.toString());

    return this.http
      .post<RechercheDocumentResponse>(
        `${this.apiUrl}/rechercheDocs`,
        request,
        { headers, params }
      )
      .pipe(
        catchError((error) => {
          console.error("Search error:", error);
          return throwError(() => error);
        })
      );
  }
  getAllLaboratoires(
    page?: number,
    size?: number,
    sort?: string
  ): Observable<any[]> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let params = new HttpParams();
    if (page !== undefined) params = params.set("page", page.toString());
    if (size !== undefined) params = params.set("size", size.toString());
    if (sort !== undefined) params = params.set("sort", sort);
    return this.http
      .get<any[]>(`${this.apiUrl}/listLaboratoires`, { params, headers })
      .pipe(
        catchError((error) => {
          console.error("Error loading laboratoires:", error);
          return of([]);
        })
      );
  }

  downloadAMM(dossierId: number): Observable<Blob> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    const url = `${this.apiUrl}/download-file-amm?idDossier=${dossierId}`;

    return this.http
      .get(url, {
        headers,
        responseType: "blob",
      })
      .pipe(
        tap((response) => {
          if (!(response instanceof Blob)) {
            throw new Error("Invalid response type");
          }
        }),
        catchError((error) => {
          console.error("Download error:", error);
          return throwError(() => new Error("Failed to download file"));
        })
      );
  }

  downloadDecision(dossierId: number): Observable<Blob> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    const url = `${this.apiUrl}/download-notification-amm?idDossier=${dossierId}`;

    return this.http
      .get(url, {
        headers,
        responseType: "blob",
      })
      .pipe(
        tap((response) => {
          if (!(response instanceof Blob)) {
            throw new Error("Invalid response type");
          }
        }),
        catchError((error) => {
          console.error("Download error:", error);
          return throwError(() => new Error("Failed to download file"));
        })
      );
  }

  // Add these methods if they don't exist

  downloadAccuse(dossierId: number): Observable<Blob> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(
      `${this.apiUrl}/download-file-accuse-reception?idDossier=${dossierId}`,
      {
        headers,
        responseType: "blob",
      }
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
