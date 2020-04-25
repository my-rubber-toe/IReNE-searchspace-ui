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
    id: string;
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

export interface MapMetadata{
    id: string;
    title: string;
    location: Array<string>;
    publication_date: string;
    incident_date: string;
    infrastructure_type: Array<string>;
    damage_type: Array<string>;
    tag: Array<string>;
    language: string;
}

export interface XY {
    id: string;
    title: string;
    tag: Array<string>;
    infrastructure_type: Array<string>;
    damage_type: Array<string>;
    publication_date: string;
    incident_date: string;
}

export interface Timeline {
    id: string;
    title: string;
    timeline: Array<object>;
}
