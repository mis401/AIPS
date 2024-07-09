export interface NewDocumentDTO {
    name: string;
    day: string;
    createdBy: number;
    communityId: number;
    type: DocumentType;
}

export enum DocumentType {
    WHITEBOARD,
    DOCUMENT,
    TODO
  }