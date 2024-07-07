import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CorrectionService {

  constructor() { }

  public compareStrings(str1: string, str2: string): boolean {
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

  public compareArrays(arr1: string[][], arr2: string[][]): boolean{
    let result = true;
    arr1.forEach(elem => {
      const correctAnswer = arr2.find(e => e.includes(elem[0]));
      if (correctAnswer) {
        elem.forEach(res => result = result && correctAnswer.includes(res));
      } else {
        result = false;
      }
    })
    return result;
  }
}
