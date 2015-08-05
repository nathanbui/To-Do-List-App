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
		for (var i=0; i < myListLength; i++) {
			myListArray.push( $("#myLists").children(".myLists-item").eq(i).data("list") ); 
		}
	}

	function updateListItemsLength() {
		listItemLength = $("#listItems-big").children("ul").length;
	}

	function updateListItems() {
		listItemArray = [];
		for (var i=0; i < listItemLength; i++) {
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
		myListTemp.find(".myList-title").html(title);
		// Create new ID for new myList
		myListArray.push(myListId);
		listItemArray.push(myListId);
		myListTemp.removeClass("hide myLists-itemTemplate").addClass("myLists-item").appendTo( $("#myLists") ) ;
		// Add empty list to the sub list items on the right side
		$("#listItems-big").append( $("<ul data-list-item=\"\"></ul>").data("list-item",myListId) );
		addListenerNewMyList();
	}

	function addListenerNewMyList() {
		updateMyListLength();
		updateMyList();
		updateListItemsLength();
		updateListItems();
		clearMyListInput();
		addListenerMyListDelete();
		addListenerMyListEdit();
		addListenerMyEditCancel();
		addListenerMyListEditConfirm();
		addListenerMyListEditEnter();
	}
	
	function showCurrentListItems () {
		$("#listItems-big").children("ul").hide();
		var target = $("#listItems-big").children("ul").data("list-item");

		for (var i=0; i < listItemLength; i++) {
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

	function clearMyListInput() {
		$(".myList-newInput").val("");
	}

	function toggleToMyListButton() {
		$(".myList-newButton").show();
		$(".myList-newForm").hide();
	}

	function toggleToMyListForm() {
		$(".myList-newButton").hide();
		$(".myList-newForm").show();
	}

	function addListenerMyListDelete() {
		// Delete MyList
		var currentList;

		$(".myList-itemDelete").on("click", function() {
			currentList = $(this).closest(".myLists-item").data().list;
			// remove list items associated with My List being removed
			findListItemNumber(currentList).remove();
			// remove My List item
			$(this).closest(".myLists-item").remove();
			updateMyList();
			updateMyListLength();
		});
	}

	function findListItemNumber(number) {
		var listItem = $("#listItems-big").children("ul");

		for (var i = 0; i < listItem.length; i++) {
			if ( $(listItem[i]).data().listItem == number ) {
				return listItem[i];
			}
		}
	}

	// Reset all other My List edit modes
	function resetMyListEditMode() {
		$(".myList-editTemplate").hide();
		$(".myList-main").show();
	}
	
	// Toggle lists and show their list items
	$("#myLists").on('click', '.myList-main', function() {
		currentMyList = $(this).closest(".myLists-item").data("list");
		showCurrentListItems();
		$(".myList-main").removeClass("highlight");
		$(this).addClass("highlight");
	});

	$("#listItem-input").keydown(function(e) {
		if (e.which == "13") {
			e.preventDefault();
			addNewListItem();
		}
	});

	// When MyList Confirm Button is Clicked
	$("#myList-confirmButton").on("click", function() {
		// hide form and show new list button
		if (checkMyListInput() == true) {
			addMyListItem($(".myList-newInput").val());
			toggleToMyListButton();
		}
	});

	// Removing list item
	$(".listItem-remove").on("click", function() {
		$(this).closest(".listItem-single").remove();
	});

	// Edit My List Title
	function addListenerMyListEdit() {
		$(".myList-itemEdit").on("click", function(event) {
			event.stopPropagation();
			var myList = $(this).closest(".myLists-item");
			var currentTitle = myList.find(".myList-title").html();
			// TODO; annotate
			resetMyListEditMode( $(this) );
			toggleToMyListButton();
			// Open current My List edit mode
			myList.find(".myList-main").hide();
			myList.find(".myList-editTemplate").show();
			myList.find(".myList-editTitle").val(currentTitle);
			myList.find(".myList-editTitle").focus();
		});
	}

	function addListenerMyListEditConfirm() {
		$(".myList-editConfirm").on("click", function() {
			checkMyListTitle( $(this) );
			console.log("save  is press");
		});
	}

	function addListenerMyListEditEnter() {
		// When 'enter' key is pressed when editting title
		$(".myList-editTitle").keydown(function(e) {
			if (e.which == "13") {
				console.log("enter is press");
				e.preventDefault();
				checkMyListTitle( $(this) );
			}
		});
	}

	function checkMyListTitle(currentElement) {
		var titleInput = $(currentElement).closest(".myList-editTemplate").find(".myList-editTitle");
		var trimmedTitle = titleInput.val().trim();
		var listTitle = $(currentElement).closest(".myLists-item").find(".myList-title");

		if (trimmedTitle.length > 0) {
			listTitle.html(trimmedTitle);
			resetCurrentMyListEditMode( $(currentElement) );
		}
	}

	function addListenerMyEditCancel() {
		// Cancel for My List edit input
		$(".myList-editCancel").on("click", function() {
			resetCurrentMyListEditMode($(this));
		});
	}


	//TODO: when list item checkbox click, toggle up moves up
	$(".listItem-checkbox").on("click", function() {
		$(this).closest(".listItem-single").slideUp();
	});

	/*
	 * RESET FUNCTIONS
	 */

	function resetCurrentMyListEditMode(currentElement) {
		$(currentElement).closest(".myLists-item").find(".myList-main").show();
		$(currentElement).closest(".myLists-item").find(".myList-editTemplate").hide();
	}

	/*
	 * RUN ONCE 
	 */
	 
	// When MyList Cancel Button is Clicked
	$("#myList-cancelButton").on("click", function() {
		// hide form and show new list button
		clearMyListInput(); // Clear input field
		$(".myList-newForm").hide();
		$(".myList-newButton").show();
	});

	// When 'enter' key is pressed when adding a new My List
	$(".sidebar").find(".myList-newInput").keydown(function(e) {
		if (e.which == "13") {
			e.preventDefault();

			if (checkMyListInput() == true) {
				addMyListItem( $(this).val() );
				$(".myList-newForm").hide();
				$(".myList-newButton").show();
			}
		}
	});

	// Add new list
	$(".sidebar").on('click', '.myList-newButton', function() {
		toggleToMyListForm();
		resetMyListEditMode();
		$(".myList-newInput").focus();
	});

	function init() {
		updateMyListLength();
		updateMyList();
		updateListItemsLength();
		updateListItems();
		showCurrentListItems();
		addListenerMyListDelete();
		addListenerMyListEdit();
		addListenerMyEditCancel();
		addListenerMyListEditConfirm();
		addListenerMyListEditEnter();

		console.log("start INIT");
		console.log(myListArray);
		console.log("end INIT");
	}

	init();

	function debug(){
		console.log("START DEBUG");
		console.log("listItemArray: ");
		console.log(listItemArray);
		console.log("listItemLength: ");
		console.log(listItemLength);
		console.log("END DEBUG");
	}
});