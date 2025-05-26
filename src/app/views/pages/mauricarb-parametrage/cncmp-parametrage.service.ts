import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AbstractServiceService} from '../../../service/AbstractService';
import {AuthenticationService} from '../../../service/authenticationService';
import {ResultVO} from '../../../modele/commun/ResultVO';
import {Utilisateur} from './modele/Utilisateur';
import {host} from '../../../util/constantes-app';
import {BeanRecherche} from './modele/beanRecherche';
import {Groupe} from './modele/groupe';
import {Clients} from "./modele/clients";
import {Produit} from "./modele/Produit";
import {Observable} from "rxjs";
import {Cadeau} from "./modele/cadeau";
import {Sms} from "./modele/sms";

/**
 * @author Med.Mansour
 */
@Injectable({
    providedIn:  'root'
})
@Injectable()
export class CncmpParametrageService extends AbstractServiceService{
    private URL_GET_GROUPE_BY_CODE = host + '/getGroupeByCode/';

    constructor( private authService:  AuthenticationService, private http:  HttpClient ) {
        super();
    }

    ajouterGroupe(groupe: Groupe): Promise<ResultVO> {
        return this.http.post(host + '/enrprofil', JSON.stringify(groupe),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    ajouterNouveauUtilisateur(user: Utilisateur): Promise<ResultVO> {
        return this.http.post(host + '/createuser', JSON.stringify(user) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    modifierUtilisateur(user: Utilisateur): Promise<ResultVO> {
        return this.http.post(host + '/modifyuser', JSON.stringify(user) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getListUtilisateurs(rechMulti: BeanRecherche):  Promise<ResultVO> {
        return this.http.post(host + '/utilisateurs', JSON.stringify(rechMulti),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getGroupesByUser(user: Utilisateur):  Promise<ResultVO> {
        return this.http.post(host + '/getGroupesByUser', JSON.stringify(user),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getEntitesSanteByUser(user: Utilisateur):  Promise<ResultVO> {
        return this.http.post(host + '/getEntitesSanteByUser', JSON.stringify(user),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    rechercherGroupe(rechMulti: BeanRecherche):  Promise<ResultVO> {
        return this.http.post(host + '/allprofils', JSON.stringify(rechMulti),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListProfils() {
        return this.http.get(host + '/profils', {headers: new HttpHeaders({authorization: this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    deleteGroupe(autorite: Groupe): Promise<ResultVO> {
        return this.http.post(host + '/deleteGroupe', JSON.stringify(autorite) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    deleteUser(user: Utilisateur): Promise<ResultVO> {
        return this.http.post(host + '/deleteUser', JSON.stringify(user) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    activerUser(user: Utilisateur): Promise<ResultVO> {
        return this.http.post(host + '/activerUser', JSON.stringify(user) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    desactiverUser(user: Utilisateur): Promise<ResultVO> {
        return this.http.post(host + '/desactiverUser', JSON.stringify(user) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getGroupeByCode(code:string) : Promise<ResultVO>{
        return this.http.get(`${this.URL_GET_GROUPE_BY_CODE}${code}`,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    enregistrerProfil(obj: any){
        return this.http.post(host+'/enrprofil', JSON.stringify(obj) ,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken(),
            'Content-Type': 'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    activerProfil(profil: Groupe){
        return this.http.post(host+'/activerprofil', JSON.stringify(profil) ,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken(),
            'Content-Type': 'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }
    desactiverProfil(profil: Groupe){
        return this.http.post(host+'/desactiverprofil', JSON.stringify(profil) , {headers:new HttpHeaders({authorization:this.authService.getJwtToken(),
            'Content-Type': 'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    activerUtilisateur(user: Utilisateur){
        return this.http.post(host+'/activeruser', JSON.stringify(user) ,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken(),
            'Content-Type': 'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }
    desactiverUtilisateur(user: Utilisateur){
        return this.http.post(host+'/desactiveruser', JSON.stringify(user) ,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken(),
            'Content-Type': 'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    ajouterClient(client: Clients) : Promise<ResultVO> {
        return this.http.post(host + '/creerClient', JSON.stringify(client) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    modifierClient(client: Clients): Promise<ResultVO> {
        return this.http.post(host + '/modifierClient', JSON.stringify(client) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    deleteClient(client: Clients): Promise<ResultVO> {
        return this.http.post(host + '/deleteUser', JSON.stringify(client) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getListClients(rechMulti: BeanRecherche):  Promise<ResultVO> {
        return this.http.post(host + '/clitens', JSON.stringify(rechMulti),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    deleteProduit(produit: Produit): Promise<ResultVO> {
        return this.http.post(host + '/deleteProduit', JSON.stringify(produit) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    ajouterProduit(produit: Produit) : Promise<ResultVO> {
        return this.http.post(host + '/saveProduit', JSON.stringify(produit) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    modifierProduit(produit: Produit) : Promise<ResultVO> {
        return this.http.post(host + '/updateProduit', JSON.stringify(produit) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getListProduit(bean: BeanRecherche):  Promise<ResultVO> {
        return this.http.post(host + '/produits', JSON.stringify(bean),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    activerClient(cli: Clients) : Promise<ResultVO> {
        return this.http.post(host + '/activerClient', JSON.stringify(cli) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    desactiverClient(cli: Clients) : Promise<ResultVO> {
        return this.http.post(host + '/desactiverClient', JSON.stringify(cli) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getReportingDate(beanRecherche: BeanRecherche, page: number, size: number):  Promise<ResultVO> {
        return this.http.post(host + '/getListeTransactions?page='+ page + '&size=' + size, JSON.stringify(beanRecherche),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getReportingMonth(beanRecherche: BeanRecherche):  Promise<ResultVO> {
        return this.http.post(host + '/reporting', JSON.stringify(beanRecherche),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListCadeau(beanRecherche: BeanRecherche) :  Promise<ResultVO> {
        return this.http.post(host + '/cadeaux', JSON.stringify(beanRecherche),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    modifierCadeau(newCadeau: Cadeau)  : Promise<ResultVO> {
        return this.http.post(host + '/updateCadeau', JSON.stringify(newCadeau) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    ajouterCadeau(newCadeau: Cadeau) : Promise<ResultVO> {
        return this.http.post(host + '/saveCadeau', JSON.stringify(newCadeau) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    deleteCadeau(newCadeau: Cadeau) : Promise<ResultVO> {
        return this.http.post(host + '/deleteCadeau', JSON.stringify(newCadeau) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    getListeTraces(bean: BeanRecherche, page: number, size: number): Promise<ResultVO> {
        return this.http.post(host + '/getListeTraces?page=' + page + '&size=' + size,
            JSON.stringify(bean),
            { headers: new HttpHeaders({
                    authorization: this.authService.getJwtToken(),
                    'Content-Type': 'application/json'
                }) })
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }

    sendMessage(newSms: Sms)  : Promise<ResultVO> {
        return this.http.post(host + '/pushSms', JSON.stringify(newSms) ,
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise()
            .then(res => res as ResultVO)
            .catch(this.handleError);
    }
}
