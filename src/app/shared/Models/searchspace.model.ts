export interface Collaborators {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Filters {
  creators: Array<string>;
  infrastructure_type: Array<string>;
  damage_type: Array<string>;
  tag: Array<string>;
}

export interface DocumentMetadata {
  id: string;
  creator: string;
  title: string;
  published: boolean;
  location: string;
  publication_date: string;
  incident_date: string;
  modification_date: string;
  infrastructure_type: Array<string>;
  damage_type: Array<string>;
  language: string;
  tag: Array<string>;
}

export interface Map {
  id: string;
  location: string;
  title: string;
  infrastructure_type: Array<string>;
  damage_type: Array<string>;
  language: string;
  tag: Array<string>;
  publication_date: string;
  incident_date: string;
  author_name: Array<string>;
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
  tag: Array<string>;
  infrastructure_type: Array<string>;
  damage_type: Array<string>;
  publication_date: string;
  incident_date: string;
  timeline: Array<object>;
}
