(function() {

    var formSearch = document.getElementsByClassName("form-search");
    var inputSearch = document.getElementsByClassName("input-search");
    var queryResultsContainer = document.getElementsByClassName("query-results-container");
    var queryResults = [];

    //Timestamp
    function timeStamp() {
        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "/"
                    + (currentdate.getMonth() + 1) + "/"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"
                    + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
        return datetime;
    }

    //Add submit eventlistener to forms
    for (var i = 0; i < formSearch.length; i++) {
        formSearch[i].addEventListener("submit", function(event){submit(event, this, i - 1)}, true);
    }

    //Add keyup eventlistener to inputs
    for (var i = 0; i < inputSearch.length; i++) {
       inputSearch[i].addEventListener("keyup", function(event){search(event, this)}, true);
    }

    //Prevent clicking "ENTER" from submitting form & save found entry to list
    function submit(event, element, i) {
        event.preventDefault();
        if (!inputSearch[i].value) {
            return;
        }
        
        queryResults.push(
                {
                    "title": element.getElementsByClassName("input-search")[0].value,
                    "timestamp": timeStamp()
                }
            );
        
        var out = "";
        
        out += "<ul>";
        Object.keys(queryResults).forEach(key => {
            out += "<li>" +
                "<span>" + queryResults[key].title + "</span>" +
                "<span>" + queryResults[key].timestamp + "</span>" + 
                "</li>";
        });
        out += "</ul>";

        queryResultsContainer[i].innerHTML = out;
        inputSearch[i].value = "";
        inputSearch[i].focus();
    }

    //Pass search terms to search function
    function search(event, input) {
        if (event.keyCode == 13) {
            return;
        }
        var autocompleteContainer = input.parentNode.nextElementSibling;

        //Remove list of suggestions if input field is empty
        if (!input.value) {
            autocompleteContainer.innerHTML = "";
            return;
        }
        searchSW(input.value, autocompleteContainer, input);
    }

    function searchSW(term, autocompleteContainer, input) {
        var xhr = new XMLHttpRequest();
        //var apiUrl = "http://api.sr.se/api/v2/programs?format=json";
        var apiUrl = "https://swapi.co/api/starships";

        xhr.open(
            "GET",
            apiUrl,
            true
        );
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var jsonResponse = JSON.parse(xhr.responseText);
                    searchData(jsonResponse);

                    function searchData(arr) {
                        var out = "";
                        var filtered = arr.results.filter(function (el) {
                            return !el.name.toLowerCase().indexOf(term.toLowerCase());
                        });

                        //Check if filtered array is not empty
                        if (filtered && filtered.length) {
                            out += "<ul>";
                                for (var i = 0; i < filtered.length; i++) {
                                    out += "<li>" + filtered[i].name + "</li>";
                                }
                            out += "</ul>";
                            autocompleteContainer.innerHTML = out;
                        } else {
                            console.log('empty array returned');
                            return;
                        }

                        autocompleteList();
                    }

                    function autocompleteList() {
                        var autocompleteContainerList = autocompleteContainer.getElementsByTagName("LI");

                        for (var i = 0; i < autocompleteContainerList.length; i++) {
                            autocompleteContainerList[i].addEventListener("click", function() {
                                input.value = this.innerText;
                                input.focus();
                                autocompleteContainer.innerHTML = "";
                            });
                        }
                    }
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }
}());
