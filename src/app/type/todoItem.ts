export interface TodoItem {
  title: string;
  detail: string;
  isCompleted: boolean;
  isShared: boolean;
  comment?: string;
  isEditingComment?: boolean;
}
