import {Injectable} from '@angular/core';
import {AuthenticationService} from './authenticationService';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {host} from '../util/constantes-app';
import {MenuItem} from '../views/layout/navbar/menu.model';
import {ResultVO} from '../modele/commun/ResultVO';
/**
 * Created by Med.Mansour on 02/05/2024.
 */

@Injectable({
    providedIn: 'root',
})
export class DesignService {

    constructor(private authService:AuthenticationService ,private http: HttpClient) { }

    getMenu() {
        return this.http.get(host+'/menu');

    }

    getMenuByUser() {
        return this.http.get(host+'/menuuser', {headers:new HttpHeaders({authorization:this.authService.getJwtToken()})})
            .toPromise().then(response => response as MenuItem[])
            .catch(this.handleError);

    }

    getAllMenu() : Promise<ResultVO>{
        return this.http.get(host+'/allmenu', {headers:new HttpHeaders({authorization:this.authService.getJwtToken()})})
            .toPromise().then(response => response as MenuItem[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.status);
    }

    loadJSON(filePath) {
        const json = this.loadTextFileAjaxSync(filePath, 'application/json');
        return JSON.parse(json);
    }

    loadTextFileAjaxSync(filePath, mimeType) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', filePath, false);
        if (mimeType != null) {
            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType(mimeType);
            }
        }
        xmlhttp.send();
        if (xmlhttp.status === 200) {
            return xmlhttp.responseText;
        }
        else {
            return null;
        }
    }
}
