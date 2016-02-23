﻿////////////////////////////////////////////////////////////
// Site.js: Handles general page loading and functionality
// Created: 17th Feb 2016.
////////////////////////////////////////////////////////////
$(function () {

    ///////////////////////////////////////////////////////////
    // Load: GetFilteredData
    // On loading the page
    ///////////////////////////////////////////////////////////
    PublicArt.getFiltered(function (data) {
        // Get the data into a format suitable for DataTables.
        var dataSet = [];
        var uniqueCategories = {};
        $.each(data, function (key, value) {
            var altText = '';
            var imgUrl = 'http://www.bathnes.gov.uk/sites/default/files/publicart/thumbnails/' + value.reference + '-a.jpg';

            var categoryHtml = '';
            var categoryArray = '';
            if (value.categories) {
                var categories = value.categories.split('|');
                $.each(categories, function (idx, cat) {
                    categoryHtml += '<span class="label label-primary">' + cat + '</span> ';
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
            $('#grid').append('<div class="grid__brick col-lg-3 col-md-4 col-xs-6" data-groups=["' + categoryArray + '"] data-title="' + value.title + '" data-date="' + value.date + '"><div class="thumbnail"><img class="img-responsive" src="' + imgUrl + '" alt="' + altText + '"><div class="wrapper"><div class="caption post-content"><p class="lead">' + value.title + '</p>' + categoryHtml + '</div></div></div></div>');
        });
        data = null;

        $('#grid').append('<div class="col-xs-1 shuffle__sizer"></div>');
        $.each(uniqueCategories, function (i, v) {
            $('#btnsCategory').append('<li data-group="' + i + '"><a>' + i + ' <span class="badge">' + v + '</span></a></li>');
        });

        // Set up Shuffle on the grid bricks.
        var grid = $('#grid')
        var sizer = grid.find('.shuffle__sizer');
        grid.shuffle({ itemSelector: '.grid__brick', sizer: sizer });

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
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, el.data('groups')) === -1) {
                    return false;
                }
                var text = $.trim(el.find('.lead').text()).toLowerCase();
                return text.indexOf(val) !== -1;
            });
        });

        ///////////////////////////////////////////////////////////
        // Event: Filter items
        // On clicking the 
        ///////////////////////////////////////////////////////////
        $('#btnsCategory li').on('click', function () {
            var isActive = $(this).hasClass('active');
            var group = isActive ? 'all' : $(this).data('group');
            $('#btnsCategory li').removeClass('active');
            $(this).toggleClass('active');
            grid.shuffle('shuffle', group);
        });
    });
});