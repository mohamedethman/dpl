/**
 * Created by Med.Mans on 02/05/2024.
 */

import {Privilege} from "./privilege";
import {MenuItem} from "../../../layout/navbar/menu.model";

export class Groupe {
    id: number;
    code: string;
    libelle: string;
    estActiver: boolean;
    fonctionnalites : MenuItem[];
}
