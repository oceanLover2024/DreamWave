export interface TodoItem {
  id: string;
  title: string;
  detail: string;
  isCompleted: boolean;
  isShared: boolean;
  comment: string;
  isEditingComment?: boolean;
  isShareNow?: boolean;
}
export type TodoRecord = TodoItem & { date: string };
export type Statistics = {
  selectedDate: string;
  isCompletedDate: Set<string>;
};
