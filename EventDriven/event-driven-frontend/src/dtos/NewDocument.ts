export interface NewDocumentDTO {
    name: string;
    day: string;
    createdBy: number;
    communityId: number;
    type: DocumentType;
    content: string;
}

export enum DocumentType {
    WHITEBOARD = 'WHITEBOARD',
    DOCUMENT = 'DOCUMENT',
    TODO = 'TODO'
  }