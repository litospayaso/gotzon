import { Injectable } from '@angular/core';
import { DatabaseInterface } from '@interfaces/databaseInterface';
import localJson from '@assets/database/bagoaz-export.json';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private allData: DatabaseInterface;

  constructor() {
    const data = localStorage.getItem('database');
    if (data) {
      this.allData = JSON.parse(data);
    } else {
      this.allData = localJson;
    }
  }

  public getAllData(): DatabaseInterface {
    const result = JSON.parse(JSON.stringify(this.allData));
    return result;
  }

  public setData(data: DatabaseInterface) {
    this.allData = data;
    localStorage.setItem('database', JSON.stringify(data));
  }
}
