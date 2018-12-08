/*eslint-env browser*/
var totalPages, pageSize = 10;
var moviesList;
var currentPage = 1;
document.addEventListener("DOMContentLoaded", function(event) {
    var sheet = localStorage.getItem("theme");
    if (sheet) switchTheme(sheet);

    var xhttp = new XMLHttpRequest();

    document.getElementById("movielist-table").style.display="none";
    document.getElementById("pagination").style.display="none";

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            showResult();
            moviesList = JSON.parse(this.responseText);
            var movie_tag = document.getElementById("movie-title");
            initializePagination();
            sort(movie_tag, 'movie_title');
        }
    };
    xhttp.open("GET", "/resources/movieslisting.json", true);
    xhttp.send();

    var showResult = function() {
        document.getElementById("loader").style.display="none";
        document.getElementById("movielist-table").style.display="";
        document.getElementById("pagination").style.display="";
    }
    
});

var initializePagination = function() {
    var len = moviesList.length;
    totalPages = Math.floor(len / pageSize) + (len % pageSize == 0 ? 0 : 1);

    var list = document.getElementById("pagination");
    list.children[2].innerHTML = "<a class='page-link'>" + currentPage + "/" + totalPages + "</a>";
    initialize();
}

var initialize = function () {
    var table = document.getElementById("moviesTable");
    table.innerHTML = "";
    var i, j = 0;
    var len = moviesList.length;

    var start = (currentPage - 1) * pageSize;
    var end = Math.min(start + pageSize, len);
    for (i = 0, j = start; j < end; j++ , i++) {
        var row = table.insertRow(i);
        row.insertCell(0).innerHTML = "<a href='" + moviesList[j]['movie_imdb_link'] + "'>" + moviesList[j]['movie_title'] + "</a>";
        row.insertCell(1).innerHTML = moviesList[j]['genres'].split("|").join();
        row.insertCell(2).innerHTML = moviesList[j]['content_rating'];
        row.insertCell(3).innerHTML = moviesList[j]['title_year'];
        row.insertCell(4).innerHTML = moviesList[j]['language'];
        row.insertCell(5).innerHTML = moviesList[j]['country'];
        row.insertCell(6).innerHTML = moviesList[j]['director_name'];
        row.insertCell(7).innerHTML = moviesList[j]['actor_1_name'] + ", " + moviesList[j]['actor_2_name'];
        row.insertCell(8).innerHTML = moviesList[j]['budget'];
    }
} 

var asc = false, prevId = null, prevColumn = null;
var sort = function(e, column) {
    if (prevColumn != null && prevColumn != column) {
        asc = true;
    } else {
        asc = (asc == true) ? false : true;
    }
    toggleIcon(e, asc);

    moviesList.sort(function (a, b) {
        var varA = (typeof a[column] === 'string') ? a[column].toUpperCase() : a[column];
        var varB = (typeof b[column] === 'string') ? b[column].toUpperCase() : b[column];

        var comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (asc == false) ? (comparison * -1) : comparison
        );
    });
    initialize();
    prevColumn = column;
}

/* For icons to toggle between up and down arrow (sorting) */
function toggleIcon(e, asc) {
    if (prevId != null) {
        document.getElementById(prevId).children[0].style.display = 'none';
        document.getElementById(prevId).children[1].style.display = 'none';
    }
    if (asc) {
        document.getElementById(e.id).children[0].style.display = 'none';
        document.getElementById(e.id).children[1].style.display = '';
    } else {
        document.getElementById(e.id).children[0].style.display = '';
        document.getElementById(e.id).children[1].style.display = 'none';
    }
    prevId = document.getElementById(e.id).id;
}

/* function for switching theme */
var switchTheme = function(sheet) {
    document.getElementById("pageStyle").setAttribute("href", "/css/" + sheet);
    if (sheet === 'light.css') {
        document.getElementById("switchTheme").setAttribute("onclick", "switchTheme('dark.css')");
        document.getElementById("switchTheme").innerText = "Dark Mode";

        document.getElementById("movieTable").classList.remove("table-dark");
        document.getElementsByTagName("nav")[0].classList.add("bg-primary");
        document.getElementsByTagName("nav")[0].classList.remove("navbar-dark");
        document.getElementsByTagName("nav")[0].classList.remove("bg-dark");
    } else {
        document.getElementById("switchTheme").setAttribute("onclick", "switchTheme('light.css')");
        document.getElementById("switchTheme").innerText = "Light Mode";

        document.getElementById("movieTable").classList.add("table-dark");
        document.getElementsByTagName("nav")[0].classList.remove("bg-primary");
        document.getElementsByTagName("nav")[0].classList.add("navbar-dark");
        document.getElementsByTagName("nav")[0].classList.add("bg-dark");
    }
    localStorage.setItem("theme", sheet);
}
function first() {
    currentPage = 1;
    initializePagination();
}
function last() {
    currentPage = totalPages;
    initializePagination();
}
function next() {
    if (currentPage < totalPages) {
        currentPage += 1;
        initializePagination();
    }
}

function prev() {
    if (currentPage > 1) {
        currentPage -= 1;
        initializePagination();
    }
}
