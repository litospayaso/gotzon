export interface LessonsInterface {
  id: string;
  title: string;
  img: string;
  lesson: boolean;
  vocabulary: boolean;
  exercises: boolean;
  complete?: string;
}
