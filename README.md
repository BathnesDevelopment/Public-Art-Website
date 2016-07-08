# Public Art Website
Front-end for the public art catalogue display on the Bath and NE Somerset Website.

[Public Art Catalogue | Bath & NE Somerset Council](http://www.bathnes.gov.uk/publicartcatalogue)

## What is it?

There was a requirement to refresh the previous public art catalogue listings on the B&NES website as these pages hadn't been looked at for a little while and weren't showing off the full value of the collection.

The public art around B&NES is something that is worth highlighting, and is an excellent collection of images and associated data.  The data in particular has been comprehensively taken for each item and offers a great deal of related history and local knowledge.

The data has been made available to the Bath: Hacked datastore (the community open data group) and this project will use the data directly from there, as well as welcome enhancements and features from the community.

[Bath: Hacked Datastore - Public Art Catalogue dataset](https://data.bathhacked.org/Heritage/Public-Art-Catalogue/uau9-ufy3)

## Technologies used

| Name | Description |
| ---- | ----------- |
| Web | HTML, JavaScript (with various libraries), and CSS |

## Build

The project is a static website but uses bower to manage dependencies.

To build, ensure you have bower installed (https://bower.io) and then run from the main directory:

bower install

This will create the bower_components directory.

## Deployment

The project will be hosted on a B&NES Council web server. As it is a plain HTML/JavaScript/CSS project, it doesn't need any complex deployment/installation process.  The code is also open to community contribution.  The process for this will be:

- The contributor either submits a pull request, or if having direct access to the repository makes those changes themselves.
- The B&NES development team will check the code changes, and if OK apply these on to a test instance for the public art team to look at
- All being well the code will be deployed to the live server

Contributors should note that the code is held here under the MIT licence.

## Usage

| Function | Instructions |
| -------- | ------------ |
| Browse gallery | The default page is a gallery of the public artworks.  By default the primary image is shown (as selected by the public arts team). There are links provided to launch an image gallery popup for each item, or see further details about the item. |
| Search | The search textbox provides a dynamic search.  Any text entered will automatically filter the gallery to only include items containing that text. |
| Filter by category | Each artwork can have multiple categories assigned to it (e.g. sculpture, mural).  The filter will show just items that include the particular cateory chosen. |
| Order by | The gallery can currently be ordered by 2 fields.  These are Date (this is a year value given to the artwork), and Title. |
| Images | The images link launches an image gallery popup for each item. |
| Details | The details link launches a popup window to see further details about the item (detailed metadata on the item, physical condition, and artists. |

## Third party licensing

| Name | Description | Link | Licence |
| ---- | ----------- | ---- | ------- |
| Shuffle | jQuery library to categorize, sort, and filter a responsive grid of items | [Shuffle](http://vestride.github.io/Shuffle/) | [MIT](https://github.com/Vestride/Shuffle/blob/master/LICENSE) |
| Leaflet | Lightweight JavaScript interactive map framework | [Leaflet](http://leafletjs.com/) | [Open Source](https://github.com/Leaflet/Leaflet/blob/master/LICENSE) |
| Lightbox for Bootstrap 3 | A lightbox module for Bootstrap | [Lightbox for Bootstrap](http://ashleydw.github.io/lightbox/) | [MIT](https://github.com/ashleydw/lightbox/blob/master/LICENSE) |
| Bootstrap | HTML, CSS, and JS framework for developing responsive, mobile first projects on the web | [Bootstrap](http://getbootstrap.com/) | [MIT](https://github.com/twbs/bootstrap/blob/master/LICENSE) |
| jQuery | Required by Bootstrap and used for general JavaScript shortcuts | [jQuery](https://jquery.com/) | [MIT](https://github.com/twbs/bootstrap/blob/master/LICENSE) |
| HTML5 Shiv | Enables use of HTML5 sectioning elements in legacy Internet Explorer | [HTML5Shiv GitHub](https://github.com/aFarkas/html5shiv) | [MIT](https://github.com/aFarkas/html5shiv/blob/master/MIT%20and%20GPL2%20licenses.md)
| Respond | Legacy IE support for media queries | [Respond GitHub](https://github.com/scottjehl/Respond/) | [MIT](https://github.com/scottjehl/Respond/blob/master/LICENSE-MIT) |

## Licence

Original code licensed with [MIT Licence](Licence.txt).

| Additional | Description | Link | Licence |
| ---------- | ----------- | ---- | ------- |
| Art catalogue data | The metadata for the art catalogue is the data that this code currently accesses to display the art details. | [Bath: Hacked datastore](https://data.bathhacked.org/Heritage/Public-Art-Catalogue/uau9-ufy3) | [Open Government Licence](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) |
| Art catalogue images | The photographs taken for each collection item. | N/A | See statement for each image within metadata.  If not given then the image remains the copyright of the original photographer. |