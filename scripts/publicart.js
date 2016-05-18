////////////////////////////////////////////////////////////
// Publicart.js: Handles the functions for retrieving public
// art catalogue data from the Bath: Hacked datastore.
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
var PublicArt = {
    /////////////////////////////////////////////////////
    // Variables
    // For calling the public art data against the BH data
    /////////////////////////////////////////////////////
    datastoreUrl: 'https://data.bathhacked.org/resource/uau9-ufy3.json',
    imageThumbsLocation: 'http://www.bathnes.gov.uk/sites/default/files/publicart/thumbnails/',
    imageFullLocation: 'http://www.bathnes.gov.uk/sites/default/files/publicart/fullsize/',
    listFilter: '$select=reference,title,date,artist1_name,artist2_name,artist3_name,artist4_name,artist5_name,artist6_name,categories,imagefilenames,imagecaptions',
    detailsFiler: '$select=description,unveilingyear,unveilingdetails,statement,material,inscription,history,notes,websiteurl,height,width,depth,diameter,surfacecondition,address,lat,lng,artist1_biography,artist1_websiteurl,artist1_startyear,artist1_endyear,artist1_notes,artist2_biography,artist2_websiteurl,artist2_startyear,artist2_endyear,artist2_notes,artist3_biography,artist3_websiteurl,artist3_startyear,artist3_endyear,artist3_notes,artist4_biography,artist4_websiteurl,artist4_startyear,artist4_endyear,artist4_notes,artist5_biography,artist5_websiteurl,artist5_startyear,artist5_endyear,artist5_notes,artist6_biography,artist6_websiteurl,artist6_startyear,artist6_endyear,artist6_notes',
    dataset: {},

    /////////////////////////////////////////////////////
    // Function: getFiltered
    // Input: callback
    // Return: an array of items from the datastore.
    /////////////////////////////////////////////////////
    getFiltered: function (callback) {
        $.get(this.datastoreUrl + '?' + this.listFilter, function (data) {
            // Data returned flattened so 'unflatten' it for each row.
            $.each(data, function (idx, row) {

                row.artists = this.artistsToArray(row);
                var alphabet = 'abcdefghi';
                row.images = [];
                if (row.imagefilenames) {
                    $.each(row.imagefilenames.split('|'), function (i, img) {
                        row.images.push(
                            {
                                filename: row.reference + '-' + alphabet[i] + '.jpg',
                                caption: (row.imagecaptions ? row.imagecaptions.split('|')[i] : '')
                            });
                    });
                    delete row.imagefilenames;
                }
                if (row.categories) row.categories = row.categories.replace('NULL', 'Uncategorised').split('|');
                this.dataset[row.reference] = row;
            }.bind(this));
            callback(data);
        }.bind(this));
    },

    /////////////////////////////////////////////////////
    // Function: getAll
    // Input: callback
    // Return: the default JSON returned by the datastore
    /////////////////////////////////////////////////////
    getAll: function (callback) {
        $.get(this.datastoreUrl, function (data) {
            callback();
        });
    },

    /////////////////////////////////////////////////////
    // Function: getItem
    // Input: id of the item to return (e.g. BA1)
    // Return: the item object
    // Merges the new data into the existing dataset
    /////////////////////////////////////////////////////
    getItem: function (id, callback) {

        if (!this.dataset[id] || !this.dataset[id]['description']) {
            var url = this.datastoreUrl + '?reference=' + id + (!this.dataset[id] ? '' : '&' + this.detailsFiler);
            $.get(url, function (data) {
                if (!this.dataset[id]) this.dataset[id] = data[0];
                // Merge in the rest of the properties.
                $.extend(this.dataset[id], data[0]);
                this.dataset[id].artists = this.artistsToArray(this.dataset[id]);
                callback(this.dataset[id]);
            }.bind(this));
        } else {
            callback(this.dataset[id]);
        }
    },

    /////////////////////////////////////////////////////
    // Function: artistsToArray
    // Input: the item that includes artist data
    // Return: the artist array
    // Returns an array of artist data from the datastore data
    /////////////////////////////////////////////////////
    artistsToArray: function (data) {
        var artists = [];
        for (var x = 1; x <= 6 ; x++) {
            if (data['artist' + x + '_name'] && (data['artist' + x + '_name'] != 'NULL')) {
                artists.push({
                    name: data['artist' + x + '_name'],
                    biography: data['artist' + x + '_biography'],
                    website: (data['artist' + x + '_websiteurl'] ? data['artist' + x + '_websiteurl'].url : ''),
                    startyear: data['artist' + x + '_startyear'],
                    endyear: data['artist' + x + '_endyear'],
                    notes: data['artist' + x + '_notes']
                });
            }
        }
        return artists;
    }
}