let apiUrl;
if (ENV.ENVIRONMENT === 'development') {
  apiUrl = 'http://localhost:8080';
} else {
  apiUrl = 'https://watch-this.herokuapp.com';
}

// Mock data
let MOCK_USER_MOVIE_DATA = {
  user: 'steve',
  password: '',
  movies: [
    {
      id: 1,
      title: 'Days of Thunder',
      imagePath: '/something.jpg'
    },
    {
      id: 2,
      title: 'The Secret Life of Pets',
      imagePath: '/something2.jpg'
    },
    {
      id: 3,
      title: 'The Shawshank Redemption',
      imagePath: '/something3.jpg'
    }
  ]
};

// Document Ready-----------------------------------------------

$(document).ready(function() {
  getAndDisplayUserMovieList();
  $('#search').on('click', function(e) {
    e.preventDefault();
    let searchKeyword = $('#user-search').val();
    getAndDisplaySearchData(searchKeyword);
    $('#user-search').val('');
  });

  // DECLARING FUNCTIONS----------------------------------------

  // Get and Display User List Data-----------------------------
  function getUserMovieList(callbackFn) {
    setTimeout(function() {
      callbackFn(MOCK_USER_MOVIE_DATA);
    }, 100);
  }

  function displayUserMovieList(data) {
    for (let i = 0; i < data.movies.length; i++) {
      $('.user-movies-list').append(
        `<li>
          <img class="movie-poster" src=${data.movies[i].imagePath}>
          <p class="title">${data.movies[i].title}</p>
          <button class="remove">Remove</button>
          <button class="watched">Watched</button>
        </li>`);
    }
  }

  function getAndDisplayUserMovieList() {
    getUserMovieList(displayUserMovieList);
  }

  // Get and Display Search Data--------------------------------
  function getSearchData(searchKeyword, callbackFn) {
    let search = {
      usersearch: searchKeyword
    };
    $.ajax({
      url: apiUrl + '/usersearch',
      type: 'GET',
      data: search,
      success: function(data) {
        callbackFn(data);
      }
    });
  }

  function displaySearchData(data) {
    if (data.results.length === 0) {
      $('.message').text("Sorry, we could not find what you are looking for. Please check your search entry and try again.");
    } else {
      $('.message').text('Results');
      for (let i = 0; i < data.results.length; i++) {
        $('.search-results-list').append(
          `<li>
            <img class="movie-poster" src="https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}">
            <p class="title">${data.results[i].title}</p>
            <button class="add">Add</button>
          </li>`);
      }
    }
  }

  function getAndDisplaySearchData(searchKeyword) {
    getSearchData(searchKeyword, displaySearchData);
  }

  // Sign up button event listener===============================

  $('#toRegister').click(function(e) {
    e.preventDefault();
    $.ajax({
      url: apiUrl + '/signup',
      type: 'GET'
    });
  });
});
