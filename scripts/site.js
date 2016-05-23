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

var currentRef = null;

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
        // And show the relevant images modal.
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

        var id = $(e.relatedTarget).data('id');
        currentRef = id;

        PublicArt.getItem(id, function () {

            // The artists display
            if (PublicArt.dataset[id].artists) {
                $.each(PublicArt.dataset[id].artists, function (key, val) {
                    $('#ulArtists').append('<li><a href="#artist' + key + '" data-toggle="tab">' + val.name + '</a></li><li class="divider></li>');
                    $('#divTabContent').append('<div class="tab-pane fade" id="artist' + key + '"><h5>' + (val.name ? val.name : '') + (val.startdate ? ' (' + val.startdate + '-' : '') + (val.enddate ? val.enddate + ' )' : '') + '</h5>' + (val.website ? '<p><a target="_blank" href=' + val.website + '>' + val.website + '</a></p>' : '') + '<p>' + (val.biography ? val.biography : '') + '</p></div>');
                });
            }

            // The title (incl date).
            $('.modal-title').not('.modal-loading').text((PublicArt.dataset[id].date ? PublicArt.dataset[id].date + ' - ' : '') + PublicArt.dataset[id].title);

            // The categories labels
            if (PublicArt.dataset[id].categories) {
                $.each(PublicArt.dataset[id].categories, function (key, cat) {
                    $('#divCategories').append('<span class="label label-' + getBootstrapColour(cat) + '">' + cat + '</span> ');
                });
            }

            // The main details tab.
            if (PublicArt.dataset[id].description) $('#divTabContent #details').append('<h5>Description</h5><p>' + PublicArt.dataset[id].description + '</p>');
            if (PublicArt.dataset[id].history) $('#divTabContent #details').append('<h5>History</h5><p>' + PublicArt.dataset[id].history + '</p>');
            if (PublicArt.dataset[id].unveilingyear) $('#divTabContent #details').append('<h5>Unveiling</h5><p>' + PublicArt.dataset[id].unveilingyear + (PublicArt.dataset[id].unveilingdetails ? ', ' + PublicArt.dataset[id].unveilingdetails : '') + '</p>');
            if (PublicArt.dataset[id].statement) $('#divTabContent #details').append('<h5>Artist statement</h5><p>' + PublicArt.dataset[id].statement + '</p>');

            // The location tab.
            if (PublicArt.dataset[id].address) $('#divTabContent #location #pLocation').text(PublicArt.dataset[id].address);

            // The physical details tab.
            if (PublicArt.dataset[id].inscription) $('#divTabContent #measurements').append('<h5>Inscription</h5><p>' + PublicArt.dataset[id].inscription + '</p>');
            if (PublicArt.dataset[id].material) $('#divTabContent #measurements').append('<h5>Material</h5><p>' + PublicArt.dataset[id].material + '</p>');

            // The measurements 
            var dimensionsTable = '<table class="table"><thead><tr><th>Height (cm)</th><th>Width (cm)</th><th>Depth (cm)</th><th>Diameter (cm)</th></tr></thead><tbody><tr><td>' + PublicArt.dataset[id].height + '</td><td>' + (PublicArt.dataset[id].width ? PublicArt.dataset[id].width : '') + '</td><td>' + (PublicArt.dataset[id].depth ? PublicArt.dataset[id].depth : '') + '</td><td>' + (PublicArt.dataset[id].diameter ? PublicArt.dataset[id].diameter : '') + '</td></tr></tbody></table>';
            $('#divTabContent #measurements').append('<h5>Measurements</h5>' + dimensionsTable);
            // To do: would quite like to do some graphical representation showing the dimensions

            $('.modal-loading').hide();
        });
    });
});