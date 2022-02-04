export interface UserDataInterface {
  [Key: number]: UserData;
}

interface UserData {
  lesson?: boolean;
  vocabulary?: boolean;
  exercises?: boolean;
}