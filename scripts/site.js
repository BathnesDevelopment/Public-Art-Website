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

		    dataSet.push([value.title, artistHtml, categoryHtml, value.date]);
		});

		$('#tblCatalogue').DataTable( {
			data: dataSet,
			columns: [
				{ title: "Title" },
				{ title: "Artist(s)" },
				{ title: "Type of work" },
				{ title: "Date" }
			]
		});
    });
});