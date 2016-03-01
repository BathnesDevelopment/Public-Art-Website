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
    imageFullLocation: 'http://www.bathnes.gov.uk/sites/default/files/publicart/',
    listFilter: '$select=reference,title,date,artist1_name,artist2_name,artist3_name,artist4_name,artist5_name,artist6_name,categories,imagefilenames',
    detailsFiler: '$select=description,unveilingyear,unveilingdetails,statement,material,inscription,history,notes,websiteurl,height,width,depth,diameter,surfacecondition,address,lat,lng,artist1_biography,artist1_websiteurl,artist1_startyear,artist1_endyear,artist1_notes,artist2_websiteurl,artist2_startyear,artist2_endyear,artist2_notes,artist3_websiteurl,artist3_startyear,artist3_endyear,artist3_notes,artist4_websiteurl,artist4_startyear,artist4_endyear,artist4_notes,artist5_websiteurl,artist5_startyear,artist5_endyear,artist5_notes,artist6_websiteurl,artist6_startyear,artist6_endyear,artist6_notes',
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

                // Build up the artists collection
                row.artists = [];
                for (var x = 1; x <= 6 ; x++) if (row['artist' + x + '_name']) row.artists.push({ name: row['artist' + x + '_name'] });

                var alphabet = 'abcdefghi';
                // Build up the images.
                row.images = [];
                if (row.imagefilenames) {
                    $.each(row.imagefilenames.split('|'), function (i, img) {
                        row.images.push({ filename: row.reference + '-' + alphabet[i] + '.jpg', caption: '' });
                    });
                }

                if (row.categories) row.categories = row.categories.split('|');
                this.dataset[row.reference] = row;
            }.bind(this));
            callback();
        }.bind(this));
    },

    /////////////////////////////////////////////////////
    // Function: getAll
    // Input: callback
    // Return: the default JSON returned by the datastore
    /////////////////////////////////////////////////////
    getAll: function (callback) {
        // If the item has been loaded already can just return that one.
        if (this.dataset['']) {
            callback(this.dataset['']);
        } else {
            $.get(this.datastoreUrl, function (data) {
                callback();
            });
        }
    },

    /////////////////////////////////////////////////////
    // Function: getItem
    // Input: id of the item to return (e.g. BA1)
    // Return: the default JSON returned by the datastore
    /////////////////////////////////////////////////////
    getItem: function (id, callback) {
        // If the item has been loaded already we don't need to again.
        if (this.dataset[id]['description']) {
            callback();
        } else {
            $.get(this.datastoreUrl + '?reference=' + id + '&' + this.detailsFiler, function (data) {
                this.dataset[id].description = data[0].description;
                callback();
            }.bind(this));
        }
    }
}