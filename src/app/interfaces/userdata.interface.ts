export interface UserDataInterface {
  [Key: number]: UserData;
}

export interface UserData {
  lesson?: boolean;
  vocabulary?: boolean;
  exercises?: boolean;
}