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
        $.each(PublicArt.dataset, function (key, value) {
            var catList = '';
            if (value.categories) {
                $.each(value.categories, function (idx, cat) {
                    if (!uniqueCategories[cat]) uniqueCategories[cat] = 0;
                    uniqueCategories[cat]++;
                });
                catList = value.categories.join('","');
            }

            // Ugly - build up the item container.
            $('#grid').append('<div class="griditem col-lg-3 col-md-4 col-xs-6" data-groups=["'
                + catList.replace(/ /g, '')
                + '"] data-title="'
                + value.title
                + '" data-date="'
                + value.date
                + '"><a class="thumbnail" href="#'
                + value.reference
                + '" data-id="'
                + value.reference
                + '" data-toggle="modal" data-target="#itemDetails">'
                + (value.images.length > 0 ? ('<img class="img-responsive" src="' + PublicArt.imageThumbsLocation + value.images[0].filename + '" alt="' + 'Art catalogue image reference ' + value.reference + '" />') : '')
                + '<div class="wrapper"><div class="caption capcontent"><p class="lead">'
                + (value.title.length > 50 ? value.title.substring(0, 50) + '&hellip;' : value.title)
                + '</p></div></div></a></div>');
        });
        $('#grid').append('<div class="col-xs-1 shufflesizer"></div>');

        // Set up the filter from the set of unique categories (and associated counts for labels).
        $.each(uniqueCategories, function (catName, catCount) {
            $('#btnsCategory').append('<li data-group="' + catName.replace(/ /g, '') + '"><a href="#' + catName.replace(/ /g, '') + '">' + catName + ' <span class="badge">' + catCount + '</span></a></li>');
        });

        // Set up the initial shuffle on the grid bricks.
        var grid = $('#grid');
        var sizer = grid.find('.shufflesizer');

        // Set a delay on the shuffle
        setTimeout(function () {
            grid.shuffle({ itemSelector: '.griditem', sizer: sizer });
        }, 500);

        ///////////////////////////////////////////////////////////
        // Event: Show modal.
        // On clicking the item it should launch the item modal
        // and call the datastore to get the item detail.
        ///////////////////////////////////////////////////////////
        $('#itemDetails').on('show.bs.modal', function (e) {

            // Clear the existing modal
            $('.modal-title').not('.modal-loading').text('');
            $('#pDescription').text('');

            // Show the loader
            $('.modal-loading').show();

            var id = $(e.relatedTarget).data('id');
            PublicArt.getItem(id, function () {
                $('.modal-title').not('.modal-loading').text(PublicArt.dataset[id].title);
                $('#pDescription').html(PublicArt.dataset[id].description);
                $('.modal-loading').hide();
            });
        });

        ///////////////////////////////////////////////////////////
        // Event: Sort
        // On changing the sort dropdown it triggers the shuffle
        // with the sort option set to the relevant data-*
        ///////////////////////////////////////////////////////////
        $('.sort-options').on('change', function () {
            grid.shuffle('sort', {
                reverse: true,
                by: function (el) {
                    return el.data(this.value);
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
            grid.shuffle('shuffle', function (el, shuffle) {
                // Only search elements in the current group
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, el.data('groups')) === -1) return false;
                var text = $.trim(el.find('.lead').text()).toLowerCase();
                return text.indexOf(val) !== -1;
            });
        });

        ///////////////////////////////////////////////////////////
        // Event: Filter items
        // On clicking the 
        ///////////////////////////////////////////////////////////
        $('#btnsCategory li').on('click', function (e) {
            e.preventDefault();
            var group = $(this).hasClass('active') ? 'all' : $(this).data('group');
            $('#btnsCategory li').not(this).removeClass('active');
            $(this).toggleClass('active');
            grid.shuffle('shuffle', group);
        });
    });
});