/**
 * Created by Med.Mans on 02/05/2024.
 */
export class SearchCriteria {
    key:string;
    operation:string;
    value:string;

    constructor(cle, op, valeur) {
      this.key = cle;
      this.operation = op;
      this.value = valeur;
    }
}
