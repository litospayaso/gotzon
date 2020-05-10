import { Component, OnInit, Input } from '@angular/core';
import { TranslatedInterface } from '@interfaces/commonInterface';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {

  @Input() translated: TranslatedInterface | boolean;

  constructor() { }

  ngOnInit() {
  }

}
