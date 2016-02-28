////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
$(function () {

    ///////////////////////////////////////////////////////////
    // Load: GetFilteredData
    // On loading the page
    ///////////////////////////////////////////////////////////
    PublicArt.getFiltered(function (data) {

        var uniqueCategories = {};
        $.each(data, function (key, value) {
            var imgAlt = 'Art catalogue image reference ' + value.reference;
            var imgUrl = 'http://www.bathnes.gov.uk/sites/default/files/publicart/thumbnails/' + value.reference + '-a.jpg';

            var categoryArray = '';
            if (value.categories) {
                var categories = value.categories.split('|');
                $.each(categories, function (idx, cat) {
                    if (!uniqueCategories[cat]) uniqueCategories[cat] = 0;
                    uniqueCategories[cat]++;
                });
                categoryArray = value.categories.split('|').join('","');
            }

            var artistHtml = '';
            if (value.artist1_name) {
                artistHtml += value.artist1_name;
                if (value.artist2_name) artistHtml += ', ' + value.artist2_name;
                if (value.artist3_name) artistHtml += ', ' + value.artist3_name;
                if (value.artist4_name) artistHtml += ', ' + value.artist4_name;
                if (value.artist5_name) artistHtml += ', ' + value.artist5_name;
                if (value.artist6_name) artistHtml += ', ' + value.artist6_name;
            }
            $('#grid').append('<div class="griditem col-lg-3 col-md-4 col-xs-6" data-groups=["' + categoryArray.replace(/ /g, '') + '"] data-title="' + value.title + '" data-date="' + value.date + '"><a class="thumbnail" href="#' + value.reference + '" data-id="' + value.reference + '" data-toggle="modal" data-target="#itemDetails"><img class="img-responsive" src="' + imgUrl + '" alt="' + imgAlt + '"><div class="wrapper"><div class="caption capcontent"><p class="lead">' + value.title.substring(0, 50) + '</p></div></div></a></div>');
        });
        data = null;
        $('#grid').append('<div class="col-xs-1 shufflesizer"></div>');

        // Set up the filter from the set of unique categories (and associated counts for labels).
        $.each(uniqueCategories, function (catName, catCount) {
            $('#btnsCategory').append('<li data-group="' + catName.replace(/ /g, '') + '"><a href="#' + catName.replace(/ /g, '') + '">' + catName + ' <span class="badge">' + catCount + '</span></a></li>');
        });

        // Set up the initial shuffle on the grid bricks.
        var grid = $('#grid')
        var sizer = grid.find('.shufflesizer');
        grid.shuffle({ itemSelector: '.griditem', sizer: sizer });

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

            PublicArt.getItem($(e.relatedTarget).data('id'), function (data) {
                $('.modal-title').not('.modal-loading').text(data[0].title);
                $('#pDescription').html(data[0].description);
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