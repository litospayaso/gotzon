import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserData, UserDataInterface } from '@app/interfaces/userdata.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: UserDataInterface = {} as UserDataInterface;
  public storage: Storage;

  constructor() {
    this.reloadData();
  }

  public async reloadData() {
    this.storage = new Storage();
    await this.storage.create();
    this.storage.get('userData').then((data) => {
      if (data) {
        this.userData = JSON.parse(data);
      } else {
        this.userData = {};
      }
    });
  }

  public getUserData(): UserDataInterface {
    const result = JSON.parse(JSON.stringify(this.userData));
    return result;
  }

  public getUserThemeData(id: number): UserData {
    const result = {
      lesson: false,
      exercises: false,
      vocabulary: false
    } as UserData;
    return this.userData[id] ? this.userData[id] : result;
  }

  public setUserData(data: UserDataInterface) {
    this.userData = data;
    this.storage.set('userData', JSON.stringify(this.userData));
  }

  public setLessonCompleted(id: number) {
    if (this.userData[Number(id)]) {
      this.userData[Number(id)].lesson = true;
    } else{
      this.userData[Number(id)] = {lesson: true};
    }
    this.storage.set('userData', JSON.stringify(this.userData));
  }

  public setVocabularyCompleted(id: number) {
    if (this.userData[Number(id)]) {
      this.userData[Number(id)].vocabulary = true;
    } else{
      this.userData[Number(id)] = {vocabulary: true};
    }
    this.storage.set('userData', JSON.stringify(this.userData));
  }

  public setExercisesCompleted(id: number) {
    if (this.userData[Number(id)]) {
      this.userData[Number(id)].exercises = true;
    } else{
      this.userData[Number(id)] = {exercises: true};
    }
    this.storage.set('userData', JSON.stringify(this.userData));
  }
}
