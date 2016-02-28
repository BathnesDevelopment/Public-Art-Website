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
    imagesLocation: 'http://www.bathnes.gov.uk/sites/default/files/publicart/thumbnails/',
    listFilter: '$select=reference,title,date,artist1_name,artist2_name,artist3_name,artist4_name,artist5_name,artist6_name,categories',
    detailsFiler: '$select=description',
    dataset: [],
    
    /////////////////////////////////////////////////////
    // Function: getFiltered
    // Input: callback
    // Return: an array of items from the datastore.
    /////////////////////////////////////////////////////
    getFiltered: function (callback) {
        $.get(this.datastoreUrl + '?' + this.listFilter, function (data) {
            // Data returned flattened so 'unflatten' it for each row.
            $.each(data, function(idx, row){
                row.artists = [];
                for (var x = 1; x <= 6 ; x++) if (row['artist' + x + '_name']) artists.push({ name: row['artist' + x + '_name'] });
                row.categories = row.categories.split('|');
            });
            callback(data);
        });
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
                callback(data);
            }); 
        }
    },

    /////////////////////////////////////////////////////
    // Function: getItem
    // Input: id of the item to return (e.g. BA1)
    // Return: the default JSON returned by the datastore

    // This includes data NOT returned by the listings[
    /////////////////////////////////////////////////////
    getItem: function (id, callback) {
        // If the item has been loaded already can just return that one.
        if (this.dataset['']) {
            callback(this.dataset[id]);
        } else {
            $.get(this.datastoreUrl + '?reference=' + id, function (data) {
                this.dataset[id] = data; 
                callback(this.dataset[id]);
            }); 
        }
    }
}