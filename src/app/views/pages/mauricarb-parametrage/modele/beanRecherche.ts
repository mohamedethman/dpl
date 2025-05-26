/**
 * Created by Med.Mans on 05/09/2024.
 */

import {Groupe} from "./groupe";

export class BeanRecherche{
    groupe: Groupe;
    username: any;
    nom: any;
    prenom: any;
    inam: any;
    nni: any;
    idPrestation: any;
    typePrestation: any;
    codeStructure: any;
    code: any = null;
    idEntite: any = null;
    debut: any = null;
    fin: any = null;
    statut: number = 0;
    grouperCode: boolean=true;
    telephone: string;
    annee: number;

    produitId: number;
    clientId: number;
    agentId: number;
    dateDebut;
    dateFin;

}