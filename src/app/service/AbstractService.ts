import {ResultVO} from '../modele/commun/ResultVO';
import {Router} from "@angular/router";
import {AuthenticationService} from "./authenticationService";
/**
 * Created by Med.Mansour on 02/05/2024.
 */

export class AbstractServiceService {

    private authServiceApp: AuthenticationService;
    protected handleError(error: any): Promise<any> {
        const resultVo = new ResultVO();
        const statusDisconnected = error.status === 403 || error.status === 401;
        this.authServiceApp.logout();

        return Promise.reject(resultVo);
    }
}
