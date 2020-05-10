import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiccionarioInterface } from '@interfaces/databaseInterface';
import $ from 'jquery';
import { TranslatedInterface } from '@interfaces/commonInterface';
// import localJson from '@assets/database/diccionario.json';

@Injectable({
  providedIn: 'root'
})
export class DiccionarioService {
  private allData: DiccionarioInterface = {};

  constructor(
    private http: HttpClient
  ) {
  }

  translate(word: string, language= 'eu'): Promise<TranslatedInterface | boolean> {
    return new Promise((resolve) => {
      this.getTranslation(word, (data) => {
        resolve(data);
      }, language);
    });
  }

  getTranslation(word: string, callback: any, language= 'eu', entry= true ) {
    const url = `https://hiztegiak.elhuyar.eus/${language === 'eu' ? 'eu_es/' : 'es_eu/'}${word}`;
    this.http.get(url,     {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }).subscribe((data) => {
      const trans: string[] = [];
      const examples: string[] = [];
      const el = $(data.replace('<!doctype html>', '').replace(/src=/gi, 'srcad='));
      if (el.find('.wrapDef').length === 1) { // Palabra encontrada.
        const strong = el.find('.lehena strong');
        for (let i = 0; i < strong.length && i < 4; i++) {
          if (!trans.includes($(strong[i]).text())) {
            trans.push(strong[i].innerText);
          }
        }
        const remark = el.find('.remark_' + (language === 'eu' ? 'es_eu' : 'eu_es'));
        for (let i = 0; i < remark.length && i < 4; i++) {
          if (!trans.includes($(remark[i]).text())) {
            trans.push(remark[i].innerText);
          }
        }
        const padDefn = el.find('.padDefn p');
        for (let i = 0; i < padDefn.length && i < 4; i++) {
          examples.push(padDefn[i].innerText);
        }
        word = el.find('#tts_source').text();
        callback({word, trans, examples, language, url});
      } else { // Palabra no encontrada.
        if (el.find('.didyoumean').length > 0 && entry) {
          this.getTranslation(el.find('.didyoumean a')[0].innerText, callback, language, false);
        } else {
          callback(false);
        }
      }
    }, (err) => {
      callback(err);
    });
  }

}
