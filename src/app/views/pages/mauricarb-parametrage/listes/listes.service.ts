import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../../../service/authenticationService';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {host} from '../../../../util/constantes-app';
import {ResultVO} from '../../../../modele/commun/ResultVO';
import {AbstractServiceService} from '../../../../service/AbstractService';
import {Appareil, EntiteSante, ServiceMedical} from "../modele/referentiels";

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class ListesService extends AbstractServiceService{
    private URL_GET_FILE_BY_ID = host + '/demandes/getFileById/';
    private URL_GET_RAPPORT_BY_ID = host + '/suivi-execution/getRapportById/';
    private URL_GET_MODELES_BY_MARQUE = host + '/referentiel/getListModelesByMarque/';

    constructor(private authService:  AuthenticationService,
                private http:  HttpClient) {
        super();
    }

    getListInstitutions() {
        return this.http.get(host + '/referentiel/getListInstitutions',
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListEtats() {
        return this.http.get(host + '/referentiel/getListEtats',
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListTypeVoitures() {
        return this.http.get(host + '/referentiel/getListTypeVoitures',
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListDirections() {
        return this.http.get(host + '/referentiel/getListMarques',
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListModelesByMarque(code:number) : Promise<ResultVO>{
        return this.http.get(`${this.URL_GET_MODELES_BY_MARQUE}${code}`,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListModeles() {
        return this.http.get(host + '/referentiel/getListModeles', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListFonctions() {
        return this.http.get(host + '/referentiel/fonctions', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListNationalites() {
        return this.http.get(host + '/referentiel/nationalites', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getFileById(id:number) : Promise<ResultVO>{
        return this.http.get(`${this.URL_GET_FILE_BY_ID}${id}`,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListParametres() {
        return this.http.get(host + '/referentiel/parametres', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListEntiteSantes() {
        return this.http.get(host + '/referentiel/getEntiteSantes', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    addNewEntiteSante(newEntiteSante: EntiteSante) :Promise<ResultVO> {
        return this.http.post(host + '/referentiel/addEntiteSante', JSON.stringify(newEntiteSante) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    deleteEntiteSante(newEntiteSante: EntiteSante) : Promise<ResultVO> {
        return this.http.post(host + '/referentiel/deleteEntiteSante', JSON.stringify(newEntiteSante) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getListServiceMedicals() {
        return this.http.get(host + '/referentiel/getServicesMedicaux', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    addNewServiceMedical(newServiceMedical: ServiceMedical)  :Promise<ResultVO> {
        return this.http.post(host + '/referentiel/addServiceMedical', JSON.stringify(newServiceMedical) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    deleteServiceMedical(newServiceMedical: ServiceMedical): Promise<ResultVO> {
        return this.http.post(host + '/referentiel/deleteServiceMedical', JSON.stringify(newServiceMedical) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getListAppareils() {
        return this.http.get(host + '/referentiel/getListAppareils', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    addNewAppareil(newAppareil: Appareil)  :Promise<ResultVO> {
        return this.http.post(host + '/referentiel/addAppareil', JSON.stringify(newAppareil) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    deleteAppareil(newAppareil: Appareil) : Promise<ResultVO> {
        return this.http.post(host + '/referentiel/deleteAppareil', JSON.stringify(newAppareil) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getTypeClients() {
        return this.http.get(host + '/listTypesClient', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }
}
