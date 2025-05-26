import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfigService} from '../../../core/services/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  version: string = 'N/A'; // Default version value

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.configService.getVersion().subscribe(data => {
      this.version = data.version;
    });
  }
}