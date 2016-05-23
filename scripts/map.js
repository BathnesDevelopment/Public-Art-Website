////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
$(function () {

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

    //////////////////
    // LIGHTBOX setup
    //////////////////
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

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
        $.each(PublicArt.dataset, function (key, value) {

            var catList = '';
            if (value.categories) {
                $.each(value.categories, function (idx, cat) {
                    if (!uniqueCategories[cat]) uniqueCategories[cat] = 0;
                    uniqueCategories[cat]++;
                });
                catList = value.categories.join('","');
            }

            var artistList = '';
            if (value.artists) {
                $.each(value.artists, function (idx, artist) {
                    if (!uniqueArtists[artist.name]) uniqueArtists[artist.name] = artist;
                    artistList += ',"' + artist.name + '"';
                });
            }

            var photosLinks = '';
            $.each(value.images, function (key, image) {
                if (key == 0) photosLinks += '<a href="' + PublicArt.imageFullLocation + image.filename + '" class="btn btn-link btn-images" data-id="' + value.reference + '" data-gallery="' + value.reference + '" data-toggle="lightbox" data-title="' + value.title + '" data-footer="Image ' + (key + 1) + ' of ' + value.images.length + '<br>' + (image.caption ? image.caption : '') + '" data-target="#itemImages">View Photos</a>'
                if (key != 0) photosLinks += '<a href="' + PublicArt.imageFullLocation + image.filename + '" class="btn btn-link" data-id="' + value.reference + '" data-gallery="' + value.reference + '" data-toggle="lightbox" data-title="' + value.title + '" data-footer="Image ' + (key + 1) + ' of ' + value.images.length + '<br>' + (image.caption ? image.caption : '') + '" data-target="#itemImages" style="display: none;">View Photos</a>'
            });

            var marker = L.AwesomeMarkers.icon({
                icon: '',
                markerColor: getBootstrapColour(value.title)
            });
            L.marker([value.lat, value.lng], { icon: marker }).bindPopup(photosLinks).addTo(map);

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
        // Event: Sort
        // On changing the sort dropdown it triggers the shuffle
        // with the sort option set to the relevant data-*
        ///////////////////////////////////////////////////////////
        $('.sort-options').on('change', function () {
            var rev = (this.value == 'date' ? true : false);
            shuffle.sort({
                reverse: rev,
                by: function (el) {
                    return el.getAttribute('data-date');
                }
            });
        });

        ///////////////////////////////////////////////////////////
        // Event: Search
        // On a keychange in the search box it will
        // trigger the JS shuffle of the collection and look
        // for matches in the item title.
        ///////////////////////////////////////////////////////////
        $('.js-shuffle-search').on('keyup change', function () {
            var val = this.value.toLowerCase();
            shuffle.filter(function (el, shuffle) {
                // Only search elements in the current group
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, el.data('groups')) === -1) return false;
                var text = el.querySelector('h5').textContent.toLowerCase().trim();
                return text.indexOf(val) !== -1;
            });
        });

        ///////////////////////////////////////////////////////////
        // Event: Filter items
        ///////////////////////////////////////////////////////////
        $('#btnsCategory li').on('click', function (e) {
            e.preventDefault();
            var group = $(this).hasClass('active') ? 'all' : $(this).data('group');
            $('#btnsCategory li').not(this).removeClass('active');
            $(this).toggleClass('active');
            $('#selArtists').val('');
            shuffle.filter(group);

            if (group != 'all') {
                $('#hdrGalleryTitle').text('Displaying items of type ' + group);
            } else {
                $('#hdrGalleryTitle').text('Displaying all items');
            }
        });

        ///////////////////////////////////////////////////////////
        // Event: Filter by artist.
        ///////////////////////////////////////////////////////////
        $('#selArtists').on('change', function () {
            $('#btnsCategory li').removeClass('active');
            var artist = this.value;
            shuffle.filter(artist);
            if (artist != '') {
                $('#hdrGalleryTitle').text('Displaying items by ' + artist);
            } else {
                $('#hdrGalleryTitle').text('Displaying all items');
            }
        });

        ///////////////////////////////////////////////////////////
        // Event: Reset filter
        ///////////////////////////////////////////////////////////
        $('#btnReset').on('change', function () {
            shuffle.filter('');
            $('#hdrGalleryTitle').text('Displaying all items');
            return false;
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