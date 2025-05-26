/**
 * Created by Med.Mans on 02/05/2024.
 */
export class  ResultVO {
  data:object={};
  messagesErrors:Array<any>=[];
  messagesInfo:Array<any>=[];
  estModeConnecte: boolean = true;
    totalElements: number;
}

export class  ResultConnect {
  UserConnected:object;
  token: string;
}


export class Nni{
  nni: string;
  key: string
}
export class Matricule{
  matricule: string;
  key: string
}
