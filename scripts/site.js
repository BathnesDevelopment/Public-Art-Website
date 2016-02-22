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

            var categoryHtml = '';
            if (value.categories) {
                var categories = value.categories.split('|');
                $.each(categories, function (idx, cat) {
                    categoryHtml += '<span class="label label-default">' + cat + '</span> ';
                });
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

            $('#grid').append('<div class="grid__brick col-xs-6 col-sm-4" data-title="This is a title 1" data-date="2014"><a class="thumbnail" href="#"><img class="img-responsive" src="http://placehold.it/400x300" alt=""></a></div>');


        });

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
                    by: function ($el) {
                        return $el.data('date');
                    }
                };
            } else if (sort === 'title') {
                opts = {
                    by: function ($el) {
                        return $el.data('title').toLowerCase();
                    }
                };
            }

            // Filter elements
            grid.shuffle('sort', opts);
        });



        $('#grid').shuffle('shuffle', function ($el, shuffle) {
            return $el.data('title').length < 20;
        });

    });
});