import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { NavigationExtras, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Utilisateur } from "../views/pages/mauricarb-parametrage/modele/Utilisateur";
import { Injectable } from "@angular/core";
import { host } from "../util/constantes-app";
import * as jwt_decode from "jwt-decode";
import { ResultVO } from "../modele/commun/ResultVO";
import { MenuItem } from "../views/layout/navbar/menu.model";
import { Prestation } from "../views/pages/mauricarb-parametrage/modele/referentiels";
import { throwError, Observable, of } from "rxjs";
import { map, catchError, tap, timeout, retry } from "rxjs/operators";

/**
 * Created by Med.Mansour on 02/05/2024.
 */

export interface AuthResponse {
  UserConnected: Utilisateur;
  token: string;
}

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  // private host:string = "http://localhost:8080";
  private jwtToken: string = null;
  private roles: Array<MenuItem> = [];
  constructor(private http: HttpClient, private router: Router) {
    //  super();
  }

  login(login: string, password: string): Promise<AuthResponse> {
    const body = { login, password };
    return this.http
      .post(host + "/login", JSON.stringify(body))
      .toPromise()
      .then((res) => res as AuthResponse)
      .catch(this.handleError);
  }

  // Add these methods to your AuthenticationService
  sendPasswordResetOTP(email: string): Observable<any> {
    return this.http.post(`${host}/auth/forgot-password`, { email });
  }

  sendPasswordResetLink(email: string): Observable<any> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.post(`${host}/resetPassword/${encodedEmail}`, {});
  }
  verifyPasswordResetOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${host}/auth/verify-reset-otp`, { email, otp });
  }

  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(`${host}/auth/reset-password`, {
      email,
      otp,
      newPassword,
    });
  }

  downloadFile(endpoint: string): Observable<Blob> {
    const url = `${host}${endpoint}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "*/*", // Accept any file type
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
      })
      .pipe(
        catchError((error) => {
          console.error("Download error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }

  downloadEvaluationZip(idDossier: number): Observable<Blob> {
    const url = `${host}/download-zip-evaluations?idDossier=${idDossier}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "application/zip",
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
      })
      .pipe(
        catchError((error) => {
          console.error("Download ZIP error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }
  saveToken(jwt: string) {
    localStorage.setItem("token", jwt);
    this.jwtToken = jwt;
    let tokenInfo = jwt_decode(
      this.jwtToken.substr("Bearer ".length, this.jwtToken.length)
    );
    this.roles = tokenInfo.roles;
  }

  loadToken() {
    if (this.jwtToken == null) {
      this.jwtToken = localStorage.getItem("token");
    }
  }

  getJwtToken(): string {
    this.loadToken();
    if (this.jwtToken && !this.jwtToken.startsWith("Bearer ")) {
      this.jwtToken = "Bearer " + this.jwtToken;
    }
    return this.jwtToken;
  }

  getUserConnected() {
    if (this.jwtToken == null) {
      return;
    }
    let jwtHelper = new JwtHelperService();
    let jwtDecoded = jwtHelper.decodeToken(this.jwtToken);
    return jwtDecoded.sub;
    //  this.roles = jwtDecoded.roles;
  }

  registerLaboratoire(laboratoireData: any): Observable<any> {
    const url = `${host}/saveLaboratoire`;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http.post(url, laboratoireData, { headers }).pipe(
      catchError((error) => {
        console.error("Registration error:", error);
        return throwError(error);
        // Important: preserve original error
      })
    );
  }

  getObjUserConnected() {
    if (this.jwtToken == null) {
      new Utilisateur();
    }
    return this.http
      .get(host + "/getuserconnected", {
        headers: new HttpHeaders({ authorization: this.getJwtToken() }),
      })
      .toPromise()
      .then((response) => response as ResultVO)
      .catch(this.handleError);
  }
  // Add to your authentication.service.ts
  updatePassword(data: {
    login: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<any> {
    return this.http
      .post(host + "/updatePassword", data, {
        headers: new HttpHeaders({ authorization: this.getJwtToken() }),
      })
      .toPromise()
      .then((response) => response)
      .catch((error) => {
        throw error.error || "Erreur lors de la mise à jour du mot de passe";
      });
  }
  // In your authentication.service.ts
  getUserConnected2(): Observable<any> {
    if (this.jwtToken == null) {
      return of(new Utilisateur());
    }
    return this.http
      .get<any>(host + "/getuserconnected", {
        headers: new HttpHeaders({ authorization: this.getJwtToken() }),
      })
      .pipe(catchError(this.handleError));
  }

  deconnectCurrentUser() {
    return this.http
      .get(host + "/deconnectCurrentUser", {
        headers: new HttpHeaders({ authorization: this.getJwtToken() }),
      })
      .toPromise()
      .then((response) => response as ResultVO)
      .catch(this.handleError);
  }

  estUserAlreadyConnected(username) {
    return this.http
      .get(host + "/estUserAlreadyConnected/" + username)
      .toPromise()
      .then((response) => response as ResultVO)
      .catch(this.handleError);
  }

  getListPrestation() {
    return this.http
      .get(host + "/prestations")
      .toPromise()
      .then((response) => response as Prestation[])
      .catch(this.handleError);
  }

  getListTypePrestation() {
    return this.http
      .get(host + "/typeprestations")
      .toPromise()
      .then((response) => response as string[])
      .catch(this.handleError);
  }

  getUserById(id: number) {
    return this.http
      .get(host + "/getUserById/" + id)
      .toPromise()
      .then((response) => response as ResultVO)
      .catch(this.handleError);
  }

  changePassword(user: Utilisateur): Promise<ResultVO> {
    return this.http
      .post(host + "/changePassword", JSON.stringify(user), {
        headers: new HttpHeaders({
          authorization: this.getJwtToken(),
          "Content-Type": "application/json",
        }),
      })
      .toPromise()
      .then((res) => res as ResultVO)
      .catch(this.handleError);
  }

  getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(host + "/Notifications", {
      headers: new HttpHeaders({
        authorization: this.getJwtToken(),
        "Content-Type": "application/json",
      }),
    });
  }

  downloadAccuseReception(idDossier: number): Observable<Blob> {
    const url = `${host}/download-file-accuse-reception?idDossier=${idDossier}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "application/pdf",
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        reportProgress: true, // Optional: track download progress
      })
      .pipe(
        catchError((error) => {
          console.error("Download error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }

  downloadRenouvellementAMM(idDossier: number): Observable<Blob> {
    const url = `${host}/download-renouvellement-amm?idDossier=${idDossier}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "application/pdf",
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        reportProgress: true, // Optional: track download progress
      })
      .pipe(
        catchError((error) => {
          console.error("Download error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }

  downloadRapportTechnique(idDossier: number): Observable<Blob> {
    const url = `${host}/download-zip-rapports-techniques?idDossier=${idDossier}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "application/pdf",
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        reportProgress: true, // Optional: track download progress
      })
      .pipe(
        catchError((error) => {
          console.error("Download error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }

  downloaddecision(idDossier: number): Observable<Blob> {
    const url = `${host}/download-notification-amm?idDossier=${idDossier}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "application/pdf",
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        reportProgress: true, // Optional: track download progress
      })
      .pipe(
        catchError((error) => {
          console.error("Download error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }

  downloadAmmn(idDossier: number): Observable<Blob> {
    const url = `${host}/download-file-amm?idDossier=${idDossier}`;
    const headers = new HttpHeaders({
      Authorization: this.getJwtToken(),
      Accept: "application/pdf",
    });

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        reportProgress: true, // Optional: track download progress
      })
      .pipe(
        catchError((error) => {
          console.error("Download error:", error);
          if (error.status === 403) {
            this.logoutWithParam();
          }
          return throwError(() => new Error("Download failed"));
        })
      );
  }

  checkAmmExists(idDossier: number): Observable<boolean> {
    if (!idDossier) return of(false);

    const url = `${host}/download-file-amm?idDossier=${idDossier}`;

    // First try HEAD request which is lighter and doesn't trigger CORS preflight
    return this.http
      .head(url, {
        headers: new HttpHeaders({
          Authorization: this.getJwtToken(),
          // Add these headers to help with CORS
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        observe: "response",
      })
      .pipe(
        map((response) => {
          // Consider 200-299 status codes as success
          return response.status >= 200 && response.status < 300;
        }),
        catchError((error: HttpErrorResponse) => {
          // If HEAD fails with 405 (Method Not Allowed), try GET
          if (error.status === 405) {
            return this.http
              .get(url, {
                headers: new HttpHeaders({
                  Authorization: this.getJwtToken(),
                  "Content-Type": "application/json",
                  Accept: "application/json",
                }),
                responseType: "blob",
                observe: "response",
              })
              .pipe(
                map((response) => true),
                catchError(() => of(false))
              );
          }
          // For CORS errors or other issues, return false
          return of(false);
        }),
        // Add timeout to prevent hanging requests
        timeout(5000),
        // Retry once if the request fails
        retry(1)
      );
  }
  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(
      host + "/lireNotification?id=" + notificationId,
      {},
      {
        headers: new HttpHeaders({
          authorization: this.getJwtToken(),
          "Content-Type": "application/json",
        }),
      }
    );
  }

  // resetPassword(user: Utilisateur): Promise<ResultVO> {
  //   return this.http
  //     .post(host + "/resetPassword", JSON.stringify(user), {
  //       headers: new HttpHeaders({
  //         authorization: this.getJwtToken(),
  //         "Content-Type": "application/json",
  //       }),
  //     })
  //     .toPromise()
  //     .then((res) => res as ResultVO)
  //     .catch(this.handleError);
  // }

  logout() {
    let resultVO: ResultVO = new ResultVO();
    localStorage.removeItem("userConnected");
    localStorage.removeItem("roles");
    localStorage.removeItem("token");
    this.deconnectCurrentUser().then(
      (resultat) => {
        resultVO = resultat;
        localStorage.removeItem("userConnected");
        localStorage.removeItem("token");
        this.jwtToken = null;
        this.router.navigateByUrl("/logout");
      },
      (error) => {
        resultVO = error;
      }
    );
  }

  logoutWithParam() {
    localStorage.removeItem("token");
    this.jwtToken = null;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        param: "Votre Session a été expirée!",
      },
    };
    this.router.navigate(["/auth/login"], navigationExtras);
  }

  handleError(error: any): Promise<any> {
    const resultVo = new ResultVO();
    //   this.logout();
    localStorage.removeItem("isLoggedin");
    if (!localStorage.getItem("isLoggedin")) {
      localStorage.clear();
      if (this.router) this.router.navigate(["/login"]);
      else console.log("Root not found");
    }
    return Promise.reject(resultVo);
  }

  selectPrestations(typePrestation: any) {
    return this.http
      .get(host + "/prestations_type/" + typePrestation)
      .toPromise()
      .then((response) => response as Prestation[])
      .catch(this.handleError);
  }
}
