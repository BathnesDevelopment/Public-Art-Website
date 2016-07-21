////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
$(function () {

    //////////////////
    // MAP setup
    // Uses CartoDB positron
    //////////////////
    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
    });
    var map = L.map('map', {
        scrollWheelZoom: false,
        center: [51.38, -2.35],
        zoom: 13
    });
    map.addLayer(layer);

    ///////////////////////////////////////////////////////////
    // Load: GetFilteredData
    // On loading the page
    ///////////////////////////////////////////////////////////
    PublicArt.getFiltered(function () {
        var uniqueCategories = {};
        var uniqueArtists = {};

        var markerArray = [];
        $.each(PublicArt.dataset, function (key, value) {

            var catList = '';
            if (value.categories) {
                $.each(value.categories, function (idx, cat) {
                    if (!uniqueCategories[cat.replace(/ /g, '')]) uniqueCategories[cat.replace(/ /g, '')] = { name: cat, count: 0 };
                    uniqueCategories[cat.replace(/ /g, '')]['count']++;
                });
                catList = value.categories.join('","');
            }

            var artistList = '';
            if (value.artists) {
                $.each(value.artists, function (idx, artist) {
                    if (!uniqueArtists[artist.name.replace(/ /g, '')]) uniqueArtists[artist.name.replace(/ /g, '')] = artist;
                    artistList += ',"' + artist.name + '"';
                });
            }

            var photosLinks = '';
            $.each(value.images, function (key, image) {
                if (key == 0) photosLinks += '<a href="' + PublicArt.imageFullLocation + image.filename + '" id="btnImg1' + value.reference + '" class="btn btn-link btn-images" data-id="' + value.reference + '" data-gallery="' + value.reference + '" data-toggle="lightbox" data-title="' + value.title + '" data-footer="Image ' + (key + 1) + ' of ' + value.images.length + '<br>' + (image.caption ? image.caption : '') + '" data-target="#itemImages">View Photos</a>'
                if (key != 0) photosLinks += '<a href="' + PublicArt.imageFullLocation + image.filename + '" class="btn btn-link" data-id="' + value.reference + '" data-gallery="' + value.reference + '" data-toggle="lightbox" data-title="' + value.title + '" data-footer="Image ' + (key + 1) + ' of ' + value.images.length + '<br>' + (image.caption ? image.caption : '') + '" data-target="#itemImages" style="display: none;">View Photos</a>'
            });
            var markerPopup = '<p class="lead">' + value.title + '</p>';

            markerPopup += '<p>';
            markerPopup += $.map(value.artists, function (i, a) {
                return i.name
            }).join(', ');
            markerPopup += '</p>';
            markerPopup += '<p>' + photosLinks + '</p>';
            
            var markerStyle = ['red','cloud']
            if (value.categories && value.categories[0]) markerStyle = getMarkerStyle(value.categories[0]);
            var marker = L.AwesomeMarkers.icon({
                icon: '',
                markerColor: markerStyle[0]
            });
            if (value.lat && value.lng) markerArray.push(L.marker([value.lat, value.lng], { icon: marker }).bindPopup(markerPopup));
        });

        var group = L.featureGroup(markerArray).addTo(map);
        // map.fitBounds(group.getBounds());

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

        ///////////////////////////////////////////////////////////
        // OnLoad: Show modal.
        ///////////////////////////////////////////////////////////
        var getParameterByName = function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        if (window.location.href.indexOf('id') != -1) {
            $('[data-ref=' + getParameterByName('id') + ']').click();
        }
    });
});