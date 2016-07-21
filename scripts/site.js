////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// Function: getBootstrapColour
// Used when choosing one of the bootstrap colours.
// Want something that will choose a colour based on text value
///////////////////////////////////////////////////////////
var getBootstrapColour = function (text) {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var index = alphabet.indexOf(text.substring(0, 1).toLowerCase());
    if (index < 5) return 'primary';
    if (index < 10) return 'success';
    if (index < 15) return 'info';
    if (index < 20) return 'warning';
    if (index < 26) return 'danger';
};

var getMarkerStyle = function (category) {
    var style = ['red', ''];
    if (category == 'Decorative') style = ['red', 'star'];
    if (category == 'Paving') style = ['darkred', 'road'];
    if (category == 'Figurative') style = ['orange', ''];
    if (category == 'Sculpture') style = ['green', 'object-align-bottom'];
    if (category == 'Abstract') style = ['darkgreen', 'question-sign'];
    if (category == 'Church Art') style = ['blue', 'institution'];
    if (category == 'Painting') style = ['purple', 'picture'];
    if (category == 'Other') style = ['darkpuple', 'flash'];
    if (category == 'Mural') style = ['cadetblue', 'users'];
    if (category == 'Photography') style = ['cadetblue', 'camera'];
    if (category == 'Drawing') style = ['cadetblue', 'pencil'];
    if (category == 'Mosaic') style = ['cadetblue', 'th'];
    if (category == 'Street furniture') style = ['cadetblue', 'road'];
    if (category == 'Surrealist') style = ['cadetblue', 'eye-open'];
    return style;
};

var currentRef = null;

var imagesMoreDetails = function (ref) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    currentRef = ref;
    // Hide the images modal.
    $('.modal').modal('hide');
    // And show the relevant images modal.
    $('#itemDetails').modal();
    return false;
};

$(function () {

    //////////////////
    // LIGHTBOX setup
    //////////////////
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

    $('#btnModalImages').on('click', function () {
        // Hide the details modal.
        $('#itemDetails').modal('hide');
        // And show the relevant detail.
        $('#btnImg1' + currentRef).ekkoLightbox();

    });

    ///////////////////////////////////////////////////////////
    // Event: Show modal.
    // On clicking the item it should launch the item modal
    // and call the datastore to get the item detail.
    ///////////////////////////////////////////////////////////
    $('#itemDetails').on('show.bs.modal', function (e) {

        // Clear the existing modal
        $('.modal-title').not('.modal-loading').text('');
        $('#divTabContent #details').empty();
        $('#divTabContent #measurements').empty();
        $('#ulArtists').empty();
        $('#divCategories').empty();
        $('#divTabContent div[id^=artist]').remove();
        $('#divTabContent #hLocation').text();

        // Show the loader
        $('.modal-loading').show();
        $('a[href="#details"]').tab('show');

        if (e && e.relatedTarget) {
            var id = $(e.relatedTarget).data('id');
            currentRef = id;
        }

        PublicArt.getItem(currentRef, function () {

            // The artists display
            if (PublicArt.dataset[currentRef].artists) {
                $.each(PublicArt.dataset[currentRef].artists, function (key, val) {
                    $('#ulArtists').append('<li><a href="#artist' + key + '" data-toggle="tab">' + val.name + '</a></li><li class="divider></li>');
                    $('#divTabContent').append('<div class="tab-pane fade" id="artist' + key + '"><h5>' + (val.name ? val.name : '') + (val.startdate ? ' (' + val.startdate + '-' : '') + (val.enddate ? val.enddate + ' )' : '') + '</h5>' + (val.website ? '<p><a target="_blank" href=' + val.website + '>' + val.website + '</a></p>' : '') + '<p>' + (val.biography ? val.biography : '') + '</p></div>');
                });
            }

            // The title (incl date).
            $('.modal-title').not('.modal-loading').text((PublicArt.dataset[currentRef].date ? PublicArt.dataset[currentRef].date + ' - ' : '') + PublicArt.dataset[currentRef].title);

            // The categories labels
            if (PublicArt.dataset[currentRef].categories) {
                $.each(PublicArt.dataset[currentRef].categories, function (key, cat) {
                    $('#divCategories').append('<span class="label label-' + getBootstrapColour(cat) + '">' + cat + '</span> ');
                });
            }

            // The main details tab.
            if (PublicArt.dataset[currentRef].description) $('#divTabContent #details').append('<h5>Description</h5><p>' + PublicArt.dataset[currentRef].description + '</p>');
            if (PublicArt.dataset[currentRef].history) $('#divTabContent #details').append('<h5>History</h5><p>' + PublicArt.dataset[currentRef].history + '</p>');
            if (PublicArt.dataset[currentRef].unveilingyear) $('#divTabContent #details').append('<h5>Unveiling</h5><p>' + PublicArt.dataset[currentRef].unveilingyear + (PublicArt.dataset[currentRef].unveilingdetails ? ', ' + PublicArt.dataset[currentRef].unveilingdetails : '') + '</p>');
            if (PublicArt.dataset[currentRef].statement) $('#divTabContent #details').append('<h5>Artist statement</h5><p>' + PublicArt.dataset[currentRef].statement + '</p>');

            // The location tab.
            if (PublicArt.dataset[currentRef].address) $('#divTabContent #location #pLocation').text(PublicArt.dataset[currentRef].address);

            // The physical details tab.
            if (PublicArt.dataset[currentRef].inscription) $('#divTabContent #measurements').append('<h5>Inscription</h5><p>' + PublicArt.dataset[currentRef].inscription + '</p>');
            if (PublicArt.dataset[currentRef].material) $('#divTabContent #measurements').append('<h5>Material</h5><p>' + PublicArt.dataset[currentRef].material + '</p>');

            // The measurements 
            var dimensionsTable = '<table class="table"><thead><tr><th>Height (cm)</th><th>Width (cm)</th><th>Depth (cm)</th><th>Diameter (cm)</th></tr></thead><tbody><tr><td>' + PublicArt.dataset[currentRef].height + '</td><td>' + (PublicArt.dataset[currentRef].width ? PublicArt.dataset[currentRef].width : '') + '</td><td>' + (PublicArt.dataset[currentRef].depth ? PublicArt.dataset[currentRef].depth : '') + '</td><td>' + (PublicArt.dataset[currentRef].diameter ? PublicArt.dataset[currentRef].diameter : '') + '</td></tr></tbody></table>';
            $('#divTabContent #measurements').append('<h5>Measurements</h5>' + dimensionsTable);
            // To do: would quite like to do some graphical representation showing the dimensions

            $('.modal-loading').hide();
        });
    });
});