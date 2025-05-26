/**
 * Created by Med.Mans on 05/09/2024.
 */

import {Groupe} from './groupe';
import {MenuItem} from "../../../layout/navbar/menu.model";
import {EntiteSante} from "./referentiels";

export class Utilisateur {

  id: number;
  login;
  password;
  prenom;
  nom;
  telephone;
  dateCreation;
  statut: boolean;
  oldPassword;
  newPassword;
  profil: Groupe;
  confirmer: string;
  nomComplet: string;
}
