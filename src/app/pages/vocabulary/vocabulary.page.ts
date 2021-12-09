import { Component, AfterViewInit } from '@angular/core';
import { VocabularyInterface } from '@app/interfaces/vocabulary.interface';
import { RequestService } from '@services/request.service';
import vocabulary from '@resources/vocabulary.json';

@Component({
  selector: 'app-vocabulary',
  templateUrl: 'vocabulary.page.html',
  styleUrls: ['vocabulary.page.scss'],
})
export class VocabularyPage implements AfterViewInit {

  public response: string;
  public isCorrecting: string;
  public evaluationClass: string;
  public current: VocabularyInterface;


  constructor(
    private requestService: RequestService,
  ) {}

  ngAfterViewInit() {
    this.setCurrent();
  }

  private setCurrent() {
    this.current = vocabulary.sort(() => Math.random() - 0.5).pop();
    this.response = '';
    this.isCorrecting = '';
  }

  public checkResponse() {
    let correct = false;
    this.current.euskaraz.forEach(e => correct = correct || this.compareStrings(this.response ? this.response : '' , e));
    if (correct){
      this.isCorrecting = ['Oso ondo! ', 'Zuzen! ', 'Egoki! '].sort(() =>  Math.random() - 0.5 ).pop();
      this.evaluationClass = 'zuzen';
    }else{
      this.isCorrecting = `Akats: ${this.current.euskaraz[0]}`;
      this.evaluationClass = 'akats';
    }
  }

  public continue() {
    let correct = false;
    this.current.euskaraz.forEach(e => correct = correct || this.compareStrings(this.response ? this.response : '' , e));
    if (!correct) {
      vocabulary.push(this.current);
    }
    this.setCurrent();
  }

  public onKeyPress(event) {
    if (event.keyCode === 13) {
      if (this.isCorrecting) {
        this.continue();
      } else {
        this.checkResponse();
      }
    }
  }

  private compareStrings(str1, str2) {
    let answer = str1;
    let solution = str2;
    if (answer === solution) {
      return true;
    }// removing punctuation marks:
    // tslint:disable-next-line:max-line-length
    answer = answer.replace(/[?=]|[¿=]|[!=]|[¡=]/gi, '').replace(/[, ]|[. ]/gi, ' ').replace(/[,]|[.]/gi, ' ').replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
    solution = solution.replace(/[?=]|[¿=]|[!=]|[¡=]/gi, '').replace(/[, ]|[. ]/gi, ' ').replace(/[,]|[.]/gi, ' ').replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
    if (answer === solution) {
      return true;
    }// removing capital letters:
    answer = answer.toLowerCase();
    solution = solution.toLowerCase();
    if (answer === solution) {
      return true;
    }// removing accent mark:
    answer = answer.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
    solution = solution.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
    if (answer === solution) {
      return true;
    }// removing quoutes:
    answer = answer.replace(/"/g, '');
    solution = solution.replace(/"/g, '');
    if (answer === solution) {
      return true;
    }// removing white spaces at the beginning and at the end:
    answer = answer.trim();
    solution = solution.trim();
    if (answer === solution) {
      return true;
    }// the answer is wrong
    return false;
  }

}
