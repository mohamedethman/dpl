/**
 * Created by Med.Mans on 05/09/2024.
 */
import {Clients} from "./clients";
import {Utilisateur} from "./Utilisateur";
import {DetailTransaction} from "./DetailTransaction";


export class Transaction {
    idTransaction: number;
    dateTransaction;
    montant: number;
    pointsAjoutes: number;
    client: Clients;
    agent: Utilisateur;

    details: DetailTransaction[];
}
