

/**
 * Created by Med.Mans on 05/09/2024.
 */

export class Clients {
    id: number;
    prenom: string;
    prenomPere: string;
    nom: string;
    telephone: string;
    email: string;
    dateAdhesion;
    dateAdhesionStr: string;
    dateNaissance;
    otp: string;
    statut: string;
    typeClient: TypeClient;
    entreprise: string;
    solde: number;
    nomComplet: string;

}

export class TypeClient {
    id: number;
    type: string;
}