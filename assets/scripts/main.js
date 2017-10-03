(function() {
    var formSearch = document.getElementsByClassName("form-search"),
    	inputSearch = document.getElementsByClassName("input-search"),
    	page = document.getElementById("search-page"),
    	loadingAnim = document.getElementsByClassName("loading-anim"),
    	listOfSelectionsContainer = document.getElementsByClassName("list-of-selections-container"),
		listOfSelectionsArray = [],
		isInputValueValid = false;

	//Timestamp
    function timeStamp() {
        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"
                    + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes()// + ":"
                    //+ currentdate.getSeconds();
        return datetime;
    }

    //Query data from url
    var getJSON = function(url, i, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);
	    xhr.responseType = 'json';
	    
	    console.log("loading...");
	    loadingAnim[i].classList.toggle("loading");
	    
	    xhr.onload = function() {
			var status = xhr.status;
			if (status === 200) {
				console.log("loading done!");
				loadingAnim[i].classList.toggle("loading");
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
			}
	    };
	    xhr.send();
	};

    //Add submit eventlistener to forms
    for (var i = 0; i < formSearch.length; i++) {
        formSearch[i].addEventListener("submit", function(event){listOfSelections(event, i - 1)}, true);
    }

    //Add keyup eventlistener to inputs
    for (var i = 0; i < inputSearch.length; i++) {
       inputSearch[i].addEventListener("keyup", function(){searchTerms(this, i - 1)}, true);
    }

    //Prevent clicking "ENTER" from submitting the form & save selected to array & get html for listOfSelections
    function listOfSelections(event, i) {
        event.preventDefault();
        
        //Check if value passed from inputfield is also found in queried data
        if (!isInputValueValid) {
			console.log("no value or value not found in queried data");
            return;
        }
        
        //Push selected "partial search list" item into array
        listOfSelectionsArray.push(
                {
                    "title": inputSearch[i].value,
                    "timestamp": timeStamp()
                }
            );

		listOfSelectionsContainer[i].innerHTML = listOfSelectionsHTML(listOfSelectionsArray);
        inputSearch[i].value = "";
        isInputValueValid = false;
    }
	
	//Create html for query list
    function listOfSelectionsHTML(listOfSelectionsArray) {
		var out = "";
        
        out += "<ul>";
		for (var i = 0 in listOfSelectionsArray) {
            out += "<li>" +
            	"<div class='clearfix'>" +
                "<span class='col-sm-6'><span>" + listOfSelectionsArray[i].title + "</span></span>" +
                "<span class='col-sm-6'>" + listOfSelectionsArray[i].timestamp + "</span>" +
                "</div>" +
				"<div role='button' class='delete-button'>" +
				"<span class='glyphicon glyphicon-remove'></span>" +
				"</div>" +
                "</li>";
        }
		out += "</ul>";

		return out;
    }

    //Pass search terms to search function
    function searchTerms(thisInputSearch, i) {
        var partialSearchResultsContainer = thisInputSearch.parentNode.nextElementSibling;

        //Remove list of suggestions if input field is empty
        if (!thisInputSearch.value) {
            partialSearchResultsContainer.innerHTML = "";
            return;
        }

        //Get data from url
	    getJSON('https://swapi.co/api/starships', i,
		function(err, data) {
	  		if (err !== null) {
	    		console.log('Something went wrong: ' + err);
	  		} else {
	    		searchData(data, thisInputSearch, partialSearchResultsContainer);
	  		}
		});
    }

	//Search results
    function searchData(arr, thisInputSearch, partialSearchResultsContainer) {
		var filtered = [];

		//Search results and push to a new empty array if matches found
        for (var i = 0 in arr.results) {
			var str = arr.results[i].name.toLowerCase();

			if (str.indexOf(thisInputSearch.value.toLowerCase()) !== -1) {
				filtered.push(arr.results[i].name);
			}
		}

		//Check if any matches found
		if (filtered && filtered.length) {
			setPartialSearchResultHTML(filtered, partialSearchResultsContainer, thisInputSearch);
		} else {
            console.log('no results found');
            return;
		}
	}
	
	//Build html for partialSearchResultsList
	function setPartialSearchResultHTML(filtered, partialSearchResultsContainer, thisInputSearch) {
        var out = "";
        
        out += "<ul>";
            for (var i = 0; i < filtered.length; i++) {
                out += "<li>" + filtered[i] + "</li>";
            }
        out += "</ul>";
        
        partialSearchResultsContainer.innerHTML = out;

        page.classList.add("results-container-open");

        partialSearchResultsList(partialSearchResultsContainer, thisInputSearch, page);
	}

	//Add click events for list items & remove list when an item has been clicked/selected
    function partialSearchResultsList(partialSearchResultsContainer, thisInputSearch) {
        var partialSearchResultsContainerList = partialSearchResultsContainer.getElementsByTagName("LI");

        for (var i = 0; i < partialSearchResultsContainerList.length; i++) {
            partialSearchResultsContainerList[i].addEventListener("click", function() {
                thisInputSearch.value = this.innerText;
                thisInputSearch.focus();
                partialSearchResultsContainer.innerHTML = "";
                page.classList.remove("results-container-open");
                isInputValueValid = true;
            });
        }
    }
}());

