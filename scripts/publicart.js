////////////////////////////////////////////////////////////
// Publicart.js: Handles the functions for retrieving public
// art catalogue data from the Bath: Hacked datastore.
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
var PublicArt = {
    // The location of the public art data.
    datastoreUrl: 'https://data.bathhacked.org/resource/uau9-ufy3.json',
    // The fields to return when listing items - Title, Artists, Categories, Date
    listFilter: '$select=reference,title,date,artist1_name,artist2_name,artist3_name,artist4_name,artist5_name,artist6_name,categories',

    /////////////////////////////////////////////////////
    // Function: getFiltered
    // Input: callback
    // Return: the default JSON returned by the datastore
    /////////////////////////////////////////////////////
    getFiltered: function (callback) {
        $.get(this.datastoreUrl + '?' + this.listFilter, function (data) {
            callback(data);
        });
    },

    /////////////////////////////////////////////////////
    // Function: getAll
    // Input: callback
    // Return: the default JSON returned by the datastore
    /////////////////////////////////////////////////////
    getAll: function (callback) {
        $.get(this.datastoreUrl, function (data) {
            callback(data);
        });
    },

    /////////////////////////////////////////////////////
    // Function: getItem
    // Input: id of the item to return (e.g. BA1)
    // Return: the default JSON returned by the datastore
    /////////////////////////////////////////////////////
    getItem: function (id, callback) {
        $.get(this.datastoreUrl + '?$where' + id, function (data) {
            callback(data);
        });
    }
}