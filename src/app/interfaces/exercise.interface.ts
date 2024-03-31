export interface ExerciseInterface {
  id: string;
  title: string;
  question: string;
  answer: string[];
  type: string;
  options?: string[];
  items?: string[][];
  translation?: string;
}
