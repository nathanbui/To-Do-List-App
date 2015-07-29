$(document).ready(function() {
	var myListArray = [];
	var myListLength = 0;
	var currentMyList = 0;
	
	var listItemArray = [];
	var listItemLength = 0;
	var currentListItem = 0;
	
	function updateMyListLength() {
		myListLength = $("#myLists").children(".myLists-item").length;
	}

	function updateMyList() {
		myListArray = [];
		for (var i=0; i<myListLength; i++) {
			myListArray.push( $("#myLists").children(".myLists-item").eq(i).data("list") ); 
		}
	}

	function updateListItemsLength() {
		listItemLength = $("#listItems-big").children("ul").length;
	}

	function updateListItems() {
		listItemArray = [];
		for (var i=0; i<listItemLength; i++) {
			listItemArray.push( $("#listItems-big").children("ul").eq(i).data("list-item") ); 
		}
	}

	function generateMyListId() {
		updateMyList();
		return myListArray.length;
	}

	function addMyListItem(title) {
		// myList template
		var myListTemp = $(".myLists-itemTemplate").clone();
		var myListId = generateMyListId();

		myListTemp.data("list",myListId);
		// USE - IF DATA OBJECT NOT WORK// myListTemp.attr('data-list', myListId);
		myListTemp.find(".myList-title").html(title);

		// Create new ID for new myList
		myListArray.push(myListId);
		listItemArray.push(myListId);
		myListTemp.removeClass("hide myLists-itemTemplate").addClass("myLists-item").appendTo( $("#myLists") ) ;
		// Add empty list to the sub list items on the right side
		$("#listItems-big").append( $("<ul data-list-item=\"\"></ul>").data("list-item",myListId) );
		
		updateMyListLength();
		updateMyList();
		updateListItemsLength();
		updateListItems();
	}
	
	function showCurrentListItems () {
		$("#listItems-big").children("ul").hide();
		var target = $("#listItems-big").children("ul").data("list-item");

		for (var i=0; i<listItemLength; i++) {
			var listItem = $("#listItems-big").children("ul").eq(i);
			if( listItem.data("list-item") === currentMyList ) {
				listItem.show();
				break;
			}
		}
	}

	function checkMyListInput () {
		return ( $(".myList-newInput").val().trim().length > 0 );
	}

	function addNewListItem() {
		var userInput = $("#listItem-input").val();
		var listItemGroup = $("#listItems-big").children("ul");

		for (var i = 0; i < listItemGroup.length; i++) {
			if ( $(listItemGroup[i]).data("list-item") == currentMyList ) {
				$(listItemGroup[i]).append("<li>"+userInput+"</li>");
				break;
			}
		}
		updateListItems();
	}
	
	// Toggle lists and show their list items
	$("#myLists").on('click', '.myLists-item', function() {
		currentMyList = $(this).data("list");
		showCurrentListItems();
	});

	// Add new list
	$(".sidebar").on('click', '.myList-newButton', function() {
		$(this).hide();
		$(".myList-newForm").show();
	});

	// When 'enter' key is pressed
	$(".sidebar").find(".myList-newInput").keydown(function(e) {
		if (e.which == "13") {
			e.preventDefault();

			if (checkMyListInput() == true) {
				addMyListItem($(".myList-newInput").val());
			}
		}
	});

	$("#listItem-input").keydown(function(e) {
		if (e.which == "13") {
			e.preventDefault();
			addNewListItem();
		}
	});


	function init() {
		updateMyListLength();
		updateMyList();
		updateListItemsLength();
		updateListItems();
		showCurrentListItems();

		console.log("start INIT");
		console.log(myListArray);
		console.log("end INIT");

	}

	init();

	function debug(){
		console.log("listItemArray: ");
		console.log(listItemArray);
		console.log("listItemLength: ");
		console.log(listItemLength);
	}
	// DEBUG
	/*console.log("myList");
	console.log(myListArray);
	console.log("currentListItemArray");
	console.log(currentListItemArray);*/
	
});
/* ADDING VALUE FROM FORM TO ITEM
$(document).ready(function() {
    $('button').click(function() {
    	var toAdd = $("input[name=message]").val();
        $('#messages').append("<p>"+toAdd+"</p>");
    });
});
*/