/**
 * Filters interface - 4 arrays of the options to filter. These are the available authors, infrastructures, damages and tags.
 */
export interface Filters {
  authors: Array<string>;
  infrastructures: Array<string>;
  damages: Array<string>;
  tags: Array<string>;
}

/**
 * Authors Interface - Authors have First Name(FN), Last Name(LN), email and faculty
 */
interface Authors {
  author_FN: string;
  author_LN: string;
  author_email: string;
  author_faculty: string;
}

/**
 * Documents Metadata interface to use in /documents
 *
 * Id- to identify the document in the Database,
 * Array of authors - following the Authors Interface,
 * A title, an array of locations following the LocationPlace interface,
 * a creation,incident and last modification dates,
 * Array of Infrastructures, Array of damages, Language used and array of tags.
 */
export interface DocumentMetadata {
    _id: string;
    author: Array<Authors>;
    title: string;
    location: Array<LocationPlace>;
    creationDate: string;
    incidentDate: string;
    lastModificationDate: string;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
    language: string;
    tagsDoc: Array<string>;
}

/**
 * Locations interface - locations have an address, a latitude coordinate and longitude coordinate
 */
export interface LocationPlace {
    address: string;
    latitude: number;
    longitude: number;
}
/**
 * Documents Metadata interface to use in /map
 *
 * Id- to identify the document in the Database,
 * Array of authors - following the Authors Interface,
 * A title, an array of locations following the LocationPlace interface,
 * a creation and incident dates,
 * Array of Infrastructures, Array of damages, Language used and array of tags.
 */
export interface MapMetadata {
    _id: string;
    title: string;
    location: Array<LocationPlace>;
    creationDate: string;
    incidentDate: string;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
    tagsDoc: Array<string>;
    language: string;
}
/**
 * Documents Metadata interface to use in /xy
 *
 * Id- to identify the document in the Database,
 * A title, an array of locations following the LocationPlace interface,
 * a creation and incident dates,
 * Array of Infrastructures, Array of damages, and array of tags.
 */
export interface XY {
    id: string;
    title: string;
    tagsDoc: Array<string>;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
    creationDate: string;
    incidentDate: string;
}
/**
 * Documents Metadata interface to use in /timeline
 *
 * Id- to identify the document in the Database,
 * A title, an array of locations following the LocationPlace interface,
 * an array with the timelines,
 * Array of Infrastructures, Array of damages, and array of tags.
 */
export interface Timeline {
    id: string;
    title: string;
    timeline: Array<object>;
    infrasDocList: Array<string>;
    damageDocList: Array<string>;
}
