////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
$(function () {

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
                if (key == 0) photosLinks += '<a href="' + PublicArt.imageFullLocation + image.filename + '" id="btnImg1' + value.reference + '" class="btn btn-link btn-images" data-id="' + value.reference + '" data-gallery="' + value.reference + '" data-toggle="lightbox" data-title="' + value.title + '" data-footer="Image ' + (key + 1) + ' of ' + value.images.length + '<br>' + (image.caption ? image.caption : '') + ' &lt;a class=btnImagesMoreDetails' + value.reference + ' href=# onclick=imagesMoreDetails(\'' + value.reference + '\') &gt;Go to details&lt;/a&gt;" data-target="#itemImages">View Photos</a>'
                if (key != 0) photosLinks += '<a href="' + PublicArt.imageFullLocation + image.filename + '" class="btn btn-link" data-id="' + value.reference + '" data-gallery="' + value.reference + '" data-toggle="lightbox" data-title="' + value.title + '" data-footer="Image ' + (key + 1) + ' of ' + value.images.length + '<br>' + (image.caption ? image.caption : '') + ' &lt;a class=btnImagesMoreDetails' + value.reference + ' href=# onclick=imagesMoreDetails(\'' + value.reference + '\') &gt;Go to details&lt;/a&gt;" data-target="#itemImages" style="display: none;">View Photos</a>'
            });

            // Ugly! - build up the item container.
            $('#grid').append('<div class="griditem col-lg-3 col-md-4 col-xs-6" data-groups=["' + catList.replace(/ /g, '') + '"' + artistList.replace(/ /g, '') + '] data-title="' + value.title + '" data-date="' + value.date + '">'
                + '<div class="thumbnail">'
                + (value.images.length > 0 ? ('<img class="img-responsive" src="' + PublicArt.imageThumbsLocation + value.images[0].filename + '" title="' + 'Art catalogue image for ' + value.title + '" alt="' + 'Art catalogue image for ' + value.title + '" />') : '')
                + '<div class="wrapper">'
                + '<div class="caption capcontent">'
                + '<h5>' + (value.title.length > 40 ? value.title.substring(0, 40) + '&hellip;' : value.title) + '</h5>'
                + '</div>'
                + photosLinks
                + '<a href="#" class="btn btn-link btn-moredetails" data-ref="' + value.reference + '" data-id="' + value.reference + '" data-toggle="modal" data-target="#itemDetails">More details</a>'
                + '</div></div></div>');
        });
        $('#grid').append('<div class="col-xs-1 shufflesizer"></div>');

        // Set up the filter from the set of unique categories (and associated counts for labels).
        $.each(uniqueCategories, function (cat, catObj) {
            //$('#btnsCategory').append('<a class="btn btn-link active" data-group="' + catName.replace(/ /g, '') + '" href="#' + catName.replace(/ /g, '') + '">' + catName + ' <span class="badge">' + catCount + '</span></a>');
            $('#btnsCategory').append('<li data-group="' + cat + '"><a href="#' + cat + '">' + catObj.name + ' <span class="badge">' + catObj.count + '</span></a></li>');
        });

        // Set up the filter from the set artists
        $.each(Object.keys(uniqueArtists).sort(), function (idx, artist) {
            $('#selArtists').append('<option value="' + artist + '">' + uniqueArtists[artist].name + '</option>');
        });

        // Set up the initial shuffle on the grid bricks.
        var Shuffle = window.shuffle;
        var element = document.getElementById('grid');
        var sizer = element.querySelector('.shufflesizer');

        var shuffle = null;
        setTimeout(function () {
            // Set a delay on the shuffle
            shuffle = new Shuffle(element, {
                itemSelector: '.griditem',
                sizer: sizer
            });
        }, 500);

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
        $('#txtSearch').on('keyup change', function () {
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
            $('#pGalleryDescription').text('');
            if (group != 'all') {
                $('#hdrGalleryTitle').text('Displaying items of type ' + uniqueCategories[group].name);
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
                $('#hdrGalleryTitle').text('Displaying items by ' + uniqueArtists[artist].name);
                $('#pGalleryDescription').text(uniqueArtists[artist].biography ? uniqueArtists[artist].biography : '');
            } else {
                $('#hdrGalleryTitle').text('Displaying all items');
                $('#pGalleryDescription').text('');
            }
        });

        ///////////////////////////////////////////////////////////
        // Event: Reset filter
        ///////////////////////////////////////////////////////////
        $('#btnReset').on('click', function () {
            $('#txtSearch').val('');
            $('#selArtists').val('');
            $('#btnsCategory li').removeClass('active');
            shuffle.filter('');
            $('#hdrGalleryTitle').text('Displaying all items');
            $('#pGalleryDescription').text('');
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