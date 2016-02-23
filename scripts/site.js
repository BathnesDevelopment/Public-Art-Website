////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
$(function () {

    // On initial load get the filtered list and initialise the table.
    PublicArt.getFiltered(function (data) {
        console.log(data);

        // Get the data into a format suitable for DataTables.
        var dataSet = [];
        $.each(data, function (key, value) {


            var altText = '';

            var imgUrl = 'http://www.bathnes.gov.uk/sites/default/files/publicart/thumbnails/' + value.reference + '-a.jpg';

            var categoryHtml = '';
            var categoryArray = '';
            if (value.categories) {
                var categories = value.categories.split('|');
                $.each(categories, function (idx, cat) {
                    categoryHtml += '<span class="label label-default">' + cat + '</span> ';
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

            $('#grid').append('<div class="grid__brick col-lg-3 col-md-4 col-xs-6" data-groups=&apos;[' + categoryArray + ']&apos; data-title="' + value.title + '" data-date="' + value.date + '"><div class="thumbnail"><img class="img-responsive" src="' + imgUrl + '" alt="' + altText + '"><div class="wrapper"><div class="caption post-content"><p class="lead">' + value.title + '</p>' + categoryHtml + '</div></div></div></div>');
        });

        $('#grid').append('<div class="col-xs-1 shuffle__sizer"></div>');

        // Set up Shuffle on the grid bricks.
        var grid = $('#grid')
        var sizer = grid.find('.shuffle__sizer');
        grid.shuffle({ itemSelector: '.grid__brick', sizer: sizer });

        // Sorting options
        $('.sort-options').on('change', function () {
            var sort = this.value,
                opts = {};
            // We're given the element wrapped in jQuery
            if (sort === 'date') {
                opts = {
                    reverse: true,
                    by: function (el) {
                        return el.data('date');
                    }
                };
            } else if (sort === 'title') {
                opts = {
                    by: function (el) {
                        return el.data('title').toLowerCase();
                    }
                };
            }
            grid.shuffle('sort', opts);
        });

        // Search
        $('.js-shuffle-search').on('keyup change', function () {
            var val = this.value.toLowerCase();
            grid.shuffle('shuffle', function (el, shuffle) {
                // Only search elements in the current group
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, el.data('groups')) === -1) {
                    return false;
                }
                var text = $.trim(el.find('.lead').text()).toLowerCase();
                return text.indexOf(val) !== -1;
            });
        });

        // Filter
        $('.btn-filter').on('click', function () {
            var isActive = $(this).hasClass('active');
            var group = isActive ? 'all' : $(this).data('group');
            if (!isActive) $('.filter-options .active').removeClass('active');
            $(this).toggleClass('active');
            grid.shuffle('shuffle', group);
        });
    });
});