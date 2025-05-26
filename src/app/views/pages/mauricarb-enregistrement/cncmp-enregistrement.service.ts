import { Injectable } from '@angular/core';
import {AbstractServiceService} from '../../../service/AbstractService';
import {Matricule, Nni, ResultVO} from "../../../modele/commun/ResultVO";
import {host} from "../../../util/constantes-app";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "../../../service/authenticationService";
import {BeanRecherche} from "../mauricarb-parametrage/modele/beanRecherche";
import {Router} from "@angular/router";

/**
 * @author Med.Mansour
 */
@Injectable({
    providedIn: 'root'
})
@Injectable()
export class CncmpEnregistrementService {
    headers;
    private URL_GET_DEMANDE_BY_ID = host + '/demandes/getDemandeById/';
    private URL_GET_AUTORISATION_BY_ID = host + '/demandes/getAutorisationById/';
    private URL_GET_PERSONNE_BY_NNI = host + '/demandes/getPersonneByNni/';
    private URL_GET_HISTO_CARD_BY_ID = host + '/demandes/getHistoriqueCardById/';
    private URL_PRINT_AUTORISATION_BY_ID = host + '/demandes/printAutorisation/';
    private URL_GET_AUTORISATION_BY_TYPE = host + '/demandes/getAutorisationByType/';
    private URL_GET_AUTORISATION_BY_MATRICULE = host + '/demandes/getAutorisationByMatricule/';
    private URL_GET_CARTE_BY_NNI = host + '/demandes/getCarteByNni/';
    private URL_GET_AUTORISATION_BY_MATRICULE_BY_TYPE = host + '/demandes/getAutorisationByMatriculeByType/';
    private URL_GET_LO_BY_ID = host + '/demandes/getLotById/';
    private URL_GET_LOTS = host + '/demandes/getListLots';

    constructor(private authService:  AuthenticationService,
                private http:  HttpClient,
                private router:Router) {
      //  super();
        this.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
    }

    handleError(error: any): Promise<any> {
        const resultVo = new ResultVO();
        localStorage.removeItem('isLoggedin');
        this.router.navigate(['/auth/login']);
        return Promise.reject(resultVo);
    }

    getListPersonneAssures(bean: BeanRecherche) :  Promise<ResultVO> {
        return this.http.post(host + '/demandes/assures', JSON.stringify(bean),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getPersonneByNni(nni: String): Promise<ResultVO> {
        return this.http.get(`${this.URL_GET_PERSONNE_BY_NNI}${nni}`,
            {headers:new HttpHeaders({authorization:this.authService.getJwtToken()})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }


    getEnregistrements(bean: BeanRecherche) :  Promise<ResultVO> {
        return this.http.post(host + '/demandes/enregistrements', JSON.stringify(bean),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }

    getListHistoPrestations(beanRecherche: BeanRecherche) :  Promise<ResultVO> {
        return this.http.post(host + '/demandes/histoPrestations', JSON.stringify(beanRecherche),
            {headers: new HttpHeaders({authorization: this.authService.getJwtToken(),
                    'Content-Type':  'application/json'})})
            .toPromise().then(response => response as ResultVO)
            .catch(this.handleError);
    }
}
