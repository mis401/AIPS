import { DocumentType } from "@prisma/client";

export class NewDocumentDTO {
    name: string;
    day: Date;
    createdBy: number;
    communityId: number;
    type: DocumentType;
}