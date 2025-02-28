export enum NoteType {
  Journal = "journal",
  Knowledge = "knowledge",
}

export type Note = {
  id: number;
  title: string;
  type: NoteType;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  embeddingUpdatedAt: Date | null;
};
