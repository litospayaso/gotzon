export interface ExerciseInterface {
  id: string;
  question: string;
  answer: string[];
  type: string;
  options?: string[];
  items?: string[][];
  translation?: string;
}
