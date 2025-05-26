import {Component, Input, OnInit} from '@angular/core';
import {ResultVO} from '../../../modele/commun/ResultVO';

@Component({
  selector: 'app-alertmessages',
  templateUrl: './alertmessages.component.html',
  styleUrls: ['./alertmessages.component.scss']
})
export class AlertmessagesComponent implements OnInit {

  @Input() resultVO: ResultVO;
  constructor() { }

  ngOnInit(): void {
  }

}
