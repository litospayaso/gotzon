import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiccionarioInterface } from '@interfaces/databaseInterface';
// import localJson from '@assets/database/diccionario.json';

@Injectable({
  providedIn: 'root'
})
export class DiccionarioService {
  private allData: DiccionarioInterface = {};

  constructor(
    private http: HttpClient
  ) {
    const data = localStorage.getItem('diccionario');
    if (data) {
      this.allData = JSON.parse(data);
    } else {
      this.allData = {};
    }
    this.http.get('https://raw.githubusercontent.com/litospayaso/livre/master/src/assets/database/diccionario.json').subscribe(
      (response: DiccionarioInterface) => {
        console.log('%c diccionario', 'background: #df03fc; color: #f8fc03', response);
        this.allData = response;
        localStorage.setItem('diccionario', JSON.stringify(response));
      });
  }

  translate(word: string): string[] {
    word = word.toLowerCase().replace(/,/g, '');
    return this.allData[word] ? this.allData[word] : [''];
  }
}
