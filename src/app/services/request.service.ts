import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VocabularyInterface } from '@app/interfaces/vocabulary.interface';
import { ThemeInterface } from '@app/interfaces/theme.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  public getVocabulary(): Observable<VocabularyInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/vocabulary.json`) as Observable<VocabularyInterface[]>;
  }

  public getThemes(): Observable<ThemeInterface[][]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/gotzon/master/src/resources/themes.json`) as Observable<ThemeInterface[][]>;
  }

}
