let apiUrl;
if (ENV === 'development') {
  apiUrl = 'http://localhost:8080';
} else {
  apiUrl = 'https://watch-this.herokuapp.com';
}

// Document Ready=====================================================
// ===================================================================

$(document).ready(function() {
  // Refresh to see if user is still logged in========================
  // =================================================================
  function isLoggedIn() {
    return $.ajax({
      url: `${apiUrl}/logged-in`,
      type: 'GET',
      success: function(user) {
        return user.loggedIn;
      },
      error: function(err) {
        throw err;
      }
    });
  }

  // Display user and watched list/Redirect user on session timeout===
    // ===============================================================
  if (LOGGED_IN) {
    // Display user movie list
    getAndDisplayUserMovieList();
    // Display most watched list
    getAndDisplayWatchedList();
    // Check if user is logged in
    setInterval(function() {
      isLoggedIn().done(function(user) {
        if (!user.loggedIn) {
          return window.location = '/users/login';
        }
      })
      .fail(function(err) {
        throw err;
      });
    }, 10000);
  }

  // Get usersearch results===========================================
  // =================================================================
  $(document).on('click', '#search', function(e) {
    e.preventDefault();
    let searchKeyword = $('#user-search').val();
    getAndDisplaySearchData(searchKeyword);
    $('#user-search').val('');
  });

  // DECLARING FUNCTIONS==============================================
  // =================================================================

  // Get and Display User List Data===================================
  // =================================================================
  function getUserMovieList(callbackFn) {
    $.ajax({
      url: apiUrl + '/users/user-movies',
      type: 'GET',
      success: function(data) {
        callbackFn(data);
      },
      error: function(err) {
        throw err;
      }
    });
  }

  function displayUserMovieList(data) {
    $('.user-movies-list').text('');
    for (let i = 0; i < data.length; i++) {
      $('.user-movies-list').append(
        `<li>
          <img class="movie-poster" src=${data[i].moviePoster}>
          <p class="title">${data[i].title}</p>
          <button class="remove" id="${data[i].movieId}">Remove</button>
          <button class="watched" id="${data[i].movieId}">Watched</button>
        </li>`);
    }
  }

  function getAndDisplayUserMovieList() {
    getUserMovieList(displayUserMovieList);
  }

  // Get and Display Search Data======================================
  // =================================================================
  function getSearchData(searchKeyword, callbackFn) {
    let search = {
      usersearch: searchKeyword
    };
    $.ajax({
      url: apiUrl + '/users/usersearch',
      type: 'GET',
      data: search,
      success: function(data) {
        callbackFn(data);
      },
      error: function(err) {
        throw err;
      }
    });
  }

  function displaySearchData(data) {
    if (data.results.length === 0) {
      $('.search-results-list').text('');
      $('.message').text("Sorry, we could not find what you are looking for. Please check your search entry and try again.");
    } else {
      $('.search-results-list').text('');
      $('.message').text('Your Search Results');
      for (let i = 0; i < data.results.length; i++) {
        $('.search-results-list').append(
          `<li>
            <img class="movie-poster" src="https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}">
            <p class="title">${data.results[i].title}</p>
            <button class="add" id="${data.results[i].id}">Add</button>
          </li>`);
      }
    }
  }

  function getAndDisplaySearchData(searchKeyword) {
    getSearchData(searchKeyword, displaySearchData);
  }

  // Get and Display Watched List Data================================
  // =================================================================
  function getWatchedMovieList(callbackFn) {
    $.ajax({
      url: apiUrl + '/users/watched',
      type: 'GET',
      success: function(data) {
        callbackFn(data);
      },
      error: function(err) {
        throw err;
      }
    });
  }

  function displayWatchedMovieList(data) {
    $('.most-watched-list').text('');
    for (let i = 0; i < data.length; i++) {
      $('.most-watched-list').append(
        `<li>
          <img class="movie-poster" src=${data[i].moviePoster}>
          <p class="title">${data[i].title}</p>
          <p class="watched-total">Watched ${data[i].watched} time(s)</p>
          <button class="add" id="${data[i].movieId}">Add</button>
        </li>`);
    }
  }

  function getAndDisplayWatchedList() {
    getWatchedMovieList(displayWatchedMovieList);
  }

  // Event Listeners==================================================
  // =================================================================

  // Dropdown Menu====================================================
  // =================================================================
  // Show dropdown
  $('.dropbtn').click(function(e) {
    e.preventDefault();
    $('#drop').toggleClass('show');
  });

  // Close dropdown
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      $('#drop').removeClass('show');
    }
  };

  // Show search bar and search results
  $('#search-menu').click(function(e) {
    e.preventDefault();
    $('.search').show();
    $('.results').show();
    $('.watched-list').hide();
    $('.user-list').hide();
  });

  // Show user list
  $('#my-list').click(function(e) {
    e.preventDefault();
    $('.search').hide();
    $('.results').hide();
    $('.watched-list').hide();
    $('.user-list').show();
  });

  // Show most watched list
  $('#most-watched').click(function(e) {
    e.preventDefault();
    $('.search').hide();
    $('.results').hide();
    $('.watched-list').show();
    $('.user-list').hide();
  });

  // Add movie to user list===========================================
  // =================================================================
  $('.search-results-list').on('click', '.add', function(e) {
    let movie = {
      movieId: e.target.id,
      moviePoster: $(this).prevAll('img').first().attr('src'),
      title: $(this).prevAll('p').text()
    };
    $.ajax({
      url: apiUrl + '/users/user-movies',
      type: 'POST',
      data: JSON.stringify(movie),
      contentType: 'application/json',
      success: function(data) {
        $('.instructions').text('Movie Added!');
        $('.watched-list, .results, .user-list').height(410);
        $('.description').show();
        getAndDisplayUserMovieList();
      }
    });
  });

  // Remove movie from user list======================================
  // =================================================================
  $('.user-movies-list').on('click', '.remove', function(e) {
    let idToDelete = {
      movieId: e.target.id
    };
    $.ajax({
      url: apiUrl + '/users/user-movies',
      type: 'PUT',
      data: JSON.stringify(idToDelete),
      contentType: 'application/json',
      success: function(data) {
        $('.instructions').text('Movie Removed!');
        $('.watched-list, .results, .user-list').height(410);
        $('.description').show();
        getAndDisplayUserMovieList();
      }
    });
  });

  // Mark Movie as Watched============================================
  // =================================================================
  $('.user-movies-list').on('click', '.watched', function(e) {
    let movie = {
      movieId: e.target.id,
      moviePoster: $(this).prevAll('img').first().attr('src'),
      title: $(this).prevAll('.title').text()
    };
    let watchedButton = '#' + e.target.id + '.watched';
    $.ajax({
      url: apiUrl + '/users/watched',
      type: 'post',
      data: JSON.stringify(movie),
      contentType: 'application/json',
      success: function() {
        $('.instructions').text('Movie Watched!');
        $('.watched-list, .results, .user-list').height(410);
        $('.description').show();
        getAndDisplayWatchedList();
        $(watchedButton).remove();
      },
      error: function() {
        conosle.log('error');
      }
    });
  });

  // Add movie to user list FROM MOST WATCHED LIST====================
  // =================================================================
  $('.most-watched-list').on('click', '.add', function(e) {
    let movie = {
      movieId: e.target.id,
      moviePoster: $(this).prevAll('img').first().attr('src'),
      title: $(this).siblings('.title').text()
    };
    $.ajax({
      url: apiUrl + '/users/user-movies',
      type: 'POST',
      data: JSON.stringify(movie),
      contentType: 'application/json',
      success: function() {
        $('.instructions').text('Movie Added!');
        $('.watched-list, .results, .user-list').height(410);
        $('.description').show();
        getAndDisplayUserMovieList();
      }
    });
  });

  // Clear description if user chooses================================
  // =================================================================
  $('.got-it').click(function(e) {
    e.preventDefault();
    $('.description').hide();
    $('.watched-list, .results, .user-list').height(455);
  });

  // Clear modal======================================================
  // =================================================================
  $('.modal-button').click(function() {
    $('.modal').hide();
    $('.feedback').text('');
  });
});
