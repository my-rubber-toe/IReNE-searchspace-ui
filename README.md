# IReNESearchspaceUi

Frontend Component of the Interdisciplinary Research Network (IReNE) - SearchSpace Provides an application to search and
visualize the documents created by collaborators in TellSpace. The features are:
* Searching of documents
* Filtering of documents with predefined options in the categories of damages, infrastructure and tags
* View a document
* Visualize the locations were the case studies happened in a map
* Graphically representation of the timeline of a document
* Graphically representation of the relation of documents with years and some predefined options

Project funded by the University of Puerto Rico Mayagüez RISE-UP. This project was generated 
with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Dependencies
1. Node 12.6.0
2. npm 6.13.1
3. [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.
4. angular/animations 9.0.7
5. angular/cdk 9.1.3
6. angular/common 9.0.7
7. angular/compiler 9.0.7
8. angular/compiler-cli 9.0.7
9. angular/core 9.0.7
10. angular/flex-layout 9.0.0-beta.29
11. angular/forms 9.0.7
12. angular/material 9.1.3
13. angular/platform-browser 9.0.7
14. angular/platform-browser-dynamic 9.0.7
15. angular/router 9.0.7
16. google/markerclustererplus 5.0.3
17. types/googlemaps 3.39.4
18. angular-google-charts 0.1.6
19. angularx-social-login 2.2.1
20. commitizen 4.0.4
21. compression latest
22. cors 2.8.5
23. express 4.17.1
24. path 0.12.7
25. rxjs 6.5.4
26. tslib 1.10.0
27. typescript 3.7.5
28. zone.js 0.10.2

## Setup
Ensure that you have the project dependencies installed. 

Run `npm install` and all dependencies will be installed automatically. After installation, the `postinstall` script will
run automatically which will build the application.

## Build

Run
```
"ng build --optimization=true --buildOptimizer=true --progress=true --output-path dist --aot --prod"
```
 to build the project. The build artifacts will be stored in the `dist/` directory.

## Running the app

At this point you can either run `npm start` or `ng serve` to run the application.

## Generating Documentation

To generate documentation files, run `npm run compodoc`.
