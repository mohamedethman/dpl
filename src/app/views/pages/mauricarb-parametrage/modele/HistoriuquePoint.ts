/**
 * Created by Med.Mans on 05/09/2024.
 */
import {Clients} from "./clients";
import {Transaction} from "./Transaction";

export class HistoriuquePoint{
    id: number;
    description: string;
    dateEntree;
    dateEntreeStr: string;
    points: number;
    client: Clients;
    transaction: Transaction;
}