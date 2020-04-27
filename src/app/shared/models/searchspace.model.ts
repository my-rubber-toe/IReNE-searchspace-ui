export interface CollaboratorRequest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Filters {
  authors: Array<string>;
  infrastructures: Array<string>;
  damages: Array<string>;
  tags: Array<string>;
}

interface Authors {
  author_FN: string;
  author_LN: string;
  author_email: string;
  author_faculty: string;
}

export interface DocumentMetadata {
    _id: string;
    author: Array<Authors>;
    title: string;
    published: boolean;
    location: Array<string>;
    creationDate: string;
    incidentDate: string;
    lastModificationDate: string;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
    language: string;
    tagsDoc: Array<string>;
}

export interface MapMetadata {
    id: string;
    title: string;
    location: Array<string>;
    creationDate: string;
    incidentDate: string;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
    tagsDoc: Array<string>;
    language: string;
}

export interface XY {
    id: string;
    title: string;
    tagsDoc: Array<string>;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
    creationDate: string;
    incidentDate: string;
}

export interface Timeline {
    id: string;
    title: string;
    timeline: Array<object>;
}
