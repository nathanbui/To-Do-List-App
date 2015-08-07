$(document).ready(function() {
	var myListArray = [];
	var myListLength = 0;
	var currentMyList = 0;
	
	var listItemArray = [];
	var listItemLength = 0;
	var currentListItem = 0;
	
	/*
	 * UPDATE FUNCTIONS
	 */

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

	function updateAllLists() {
		updateMyListLength();
		updateMyList();
		updateListItemsLength();
		updateListItems();
	}

	function updateListItemTitle() {
		$(".listItem-title").html( findCurrentMyList().find(".myList-title").html() );
	}

	/*
	 * MY LIST FUNCTIONS
	 */

	function generateMyListId() {
		updateMyList();
		return myListArray.length;
	}

	function addMyListItem(title) {
		// myList template
		var myListTemp = $(".myLists-itemTemplate").clone(true);
		var myListId = generateMyListId();

		myListTemp.data("list",myListId);
		myListTemp.find(".myList-title").html(title);
		// Create new ID for new myList
		myListArray.push(myListId);
		listItemArray.push(myListId);
		myListTemp.removeClass("hide myLists-itemTemplate").addClass("myLists-item").appendTo( $("#myLists") ) ;
		// Add empty list to the sub list items on the right side
		$("#listItems-big").append( $("<ul data-list-item=\"\"></ul>").data("list-item",myListId) );
		updateAllLists();
		hideMyListEmpty();
	}

	function toggleToMyListButton() {
		$(".myList-newButton").show();
		$(".myList-newForm").hide();
	}

	function toggleToMyListForm() {
		$(".myList-newButton").hide();
		$(".myList-newForm").show();
	}

	function checkMyListEmpty() {
		var message = $(".myList-empty");
		var myLists = $(".myLists-item");
		
		if (myLists.length === 0) {
			message.show();
		}
	}

	function hideMyListEmpty() {
		$(".myList-empty").hide();
	}

	function hideListItemTitleButton() {
		$(".listItem-title").hide();
		$(".listItem-newButton").hide();
		$(".listItem-form").hide();
	}

	function toggleListItemTitleButton() {
		$(".listItem-title").show();
		$(".listItem-newButton").show();
	}

	function checkHideListItemTitleButton(currentElement) {
		if ( $(currentElement).closest(".myList-main").hasClass("highlight") ) {
			hideListItemTitleButton();
		}
	}

	/*
	 * LIST ITEM FUNCTIONS
	 */
	function addNewListItem(userInput) {
		var listItemGroup = $("#listItems-big").children("ul");
		var listItemTemp = $(".listItem-singleTemplate").clone(true).removeClass("listItem-singleTemplate");
		var listItemProcessed = listItemTemp.find(".listItem-text").html(userInput).closest(".listItem-single");

		for (var i = 0; i < listItemGroup.length; i++) {
			if ( $(listItemGroup[i]).data("list-item") == currentMyList ) {
				$(listItemGroup[i]).append(listItemProcessed);
				break;
			}
		}
		updateListItems();
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

	function toggleNewItemForm() {
		$(".listItem-newButton").hide();
		$(".listItem-form").show();
	}

	function resetNewItemForm() {
		$(".listItem-newButton").show();
		$(".listItem-form").hide();
		$("#listItem-input").val("");
	}

	function checkMyListInput () {
		return ( $(".myList-newInput").val().trim().length > 0 );
	}

	function findListItemNumber(number) {
		var listItem = $("#listItems-big").children("ul");

		for (var i = 0; i < listItem.length; i++) {
			if ( $(listItem[i]).data().listItem == number ) {
				return listItem[i];
			}
		}
	}

	function findCurrentMyList() {
		var myList = $(".myLists-item");
		
		for (var i = 0; i < myList.length; i++) {
			if ( $(myList[i]).data().list == currentMyList ) {
				return $(myList[i]);
				break;
			}
		}
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

	/*
	 * CLICK FUNCTIONS
	 */
	
	// Toggle lists and show their list items
	function addListenerShowMyLists() {
		$("#myLists").on('click', '.myList-main', function() {
			currentMyList = $(this).closest(".myLists-item").data("list");
			showCurrentListItems();
			$(".myList-main").removeClass("highlight");
			$(this).addClass("highlight");
			updateListItemTitle();
			resetNewItemForm();
			toggleListItemTitleButton();
		});
	}

	function addListenerListItemInput() {
		$("#listItem-input").keydown(function(e) {
			if (e.which == "13") {
				e.preventDefault();
				var userInput = $(this).val().trim();
				
				if (userInput.length > 0) {
					addNewListItem(userInput);
					$(this).val("");
				}
			}
		});
	}

	function addListenerNewItemButton() {
		$(".listItem-newButton").on("click", function() {
			toggleNewItemForm();
			$("#listItem-input").focus();
		});
	}

	function addListenerMyListEditCancel() {
		// Cancel for My List edit input
		$(".myList-editCancel").on("click", function() {
			resetCurrentMyListEditMode($(this));
		});
	}

	function addListenerMyListEditEnter() {
		// When 'enter' key is pressed when editting title
		$(".myList-editTitle").keydown(function(e) {
			if (e.which == "13") {
				console.log("enter is press");
				e.preventDefault();
				checkMyListTitle( $(this) );
				updateListItemTitle();
			}
		});
	}

	function addListenerMyListEditConfirm() {
		$(".myList-editConfirm").on("click", function() {
			checkMyListTitle( $(this) );
			updateListItemTitle();
		});
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
			checkMyListEmpty();
			checkHideListItemTitleButton( $(this) );
		});
	}

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

	// Removing list item
	function addListenerListItemRemove() {
		$(".listItem-remove").on("click", function() {
			$(this).closest(".listItem-single").remove();
			resetNewItemForm();
		});
	}

	function addListenerAddListButton() {
		// When MyList Cancel Button is Clicked
		$("#myList-cancelButton").on("click", function() {
			// hide form and show new list button
			clearMyListInput(); // Clear input field
			$(".myList-newForm").hide();
			$(".myList-newButton").show();
		});
	}

	// When MyList Confirm Button is Clicked
	function addListenerConfirmNewMyList() {
		$("#myList-confirmButton").on("click", function() {
			// hide form and show new list button
			if (checkMyListInput() == true) {
				addMyListItem($(".myList-newInput").val());
				toggleToMyListButton();
			}
		});
	}

	// When 'enter' key is pressed when adding a new My List
	function addListenerMyListEnterNewList() {
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
	}

	function addListenerListItemCancel() {
		$("#listItem-cancel").on("click", function() {
			resetNewItemForm();
		});
	}

	function addListenerListItemButton() {
		$("#listItem-confirm").on("click", function() {
			var inputField = $("#listItem-input");
			var userInput = $("#listItem-input").val().trim();

			if (userInput.length > 0) {
				addNewListItem(userInput);
				inputField.val("");
				inputField.focus();
			}
		});
	}

	/*
	 * RESET FUNCTIONS
	 */

	function resetCurrentMyListEditMode(currentElement) {
		$(currentElement).closest(".myLists-item").find(".myList-main").show();
		$(currentElement).closest(".myLists-item").find(".myList-editTemplate").hide();
	}

	function clearMyListInput() {
		$(".myList-newInput").val("");
	}

	// Reset all other My List edit modes
	function resetMyListEditMode() {
		$(".myList-editTemplate").hide();
		$(".myList-main").show();
	}

	/*
	 * RUN ONCE 
	 */

	// List item completed toggle delete
	function addListenerListItemComplete() {
		$(".listItem-checkbox").on("click", function() {
			$(this).closest(".listItem-single").slideUp();
		});
	}

	// Add new list
	function addListenerNewMyList() {
		$(".sidebar").on('click', '.myList-newButton', function() {
			toggleToMyListForm();
			resetMyListEditMode();
			clearMyListInput();
			$(".myList-newInput").focus();
		});
	}

	function init() {
		updateMyListLength();
		updateMyList();
		updateListItemsLength();
		updateListItems();
		showCurrentListItems();
		addListenerMyListDelete();
		addListenerMyListEdit();
		addListenerMyListEditCancel();
		addListenerMyListEditConfirm();
		addListenerMyListEditEnter();
		addListenerAddListButton();
		addListenerListItemRemove();
		addListenerShowMyLists();
		addListenerMyListEnterNewList();
		addListenerConfirmNewMyList();
		updateListItemTitle();
		addListenerNewItemButton();
		addListenerNewMyList();
		addListenerListItemCancel();
		addListenerListItemInput();
		addListenerListItemButton();
		addListenerListItemComplete();
	}

	init();
});