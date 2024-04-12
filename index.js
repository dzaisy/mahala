document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:3000/games';
  const favourite = document.getElementById('favourite-button');
  const login = document.getElementById('login-button');
  const loginModal = document.getElementById('modal');
  const closeLoginModal = document.getElementById('close-modal');
  const loginModalButton = document.getElementById('login-modal');
  const signupModalButton = document.getElementById('signup-modal');
  const searchInput = document.getElementById('searchInput');
  const gameContainer = document.getElementById('game-container');
    
  function fetchGames() { // fetching games from api
      fetch(apiUrl)
          .then(response => { // response processing
              if(!response.ok) {
                  throw new Error('failure fetching games');
              }
              return response.json();
          })
          .then(data => { // calls function with data fetched
              displayGames(data);
          })
          .catch(error => { // error handling
              console.error('error fetching games', error)
          })
  }
  fetchGames();

  function displayGames(games) { // game display on page
      gameContainer.innerHTML = ''; // clears game container
      games.forEach(game => {
          const gameCard = createGameCard(game);
          gameContainer.appendChild(gameCard);
      });
  };

  function createGameCard(game) { // creating game card
      const { title, thumbnail, genre, short_des } = game;

      const gameCard = document.createElement('div');
      gameCard.classList.add('game-card');

      const overlay = document.createElement('div');
      gameCard.classList.add('overlay');
      gameCard.appendChild(overlay);

      const img = document.createElement('img');
      img.src = thumbnail;
      img.alt = title;
      img.classList.add('game-thumbnail');
      gameCard.appendChild(img);

      const heading = document.createElement('h3');
      heading.textContent = title;
      gameCard.appendChild(heading);

      const genreId = document.createElement('p');
      genreId.textContent = genre;
      gameCard.appendChild(genreId)

      const description = document.createElement('p');
      description.textContent = short_des;
      gameCard.appendChild(description);

      const favouriteButton = document.createElement('button');
      favouriteButton.innerHTML = '&#10084;';
      favouriteButton.classList.add('favourite-button');
      favouriteButton.addEventListener('click', function() {
          console.log('favourite button clicked for game:', game['title']);
            favouriteButton.style.color = favouriteButton.style.color === 'red' ? 'grey' : 'red';
      });
      gameCard.appendChild(favouriteButton);

      const commentButton = document.createElement('button');
      commentButton.innerHTML = '&#128172;'; // unicode for comment icon
      commentButton.classList.add('comment-button');
      commentButton.addEventListener('click', function() {
        openCommentModal(game);
      });
      gameCard.appendChild(commentButton);

      return gameCard;
  }

  favourite.addEventListener('click', () => {
    console.log('favourite button clicked');
  })

  login.addEventListener('click', () => {
      loginModal.style.display = 'block';
  });

  closeLoginModal.addEventListener('click', () => {
      loginModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });

  loginModalButton.addEventListener('click', () => {
    console.log('login button clicked');
  });

  signupModalButton.addEventListener('click', () => {
    console.log('sign Up button clicked');
  });

  function searchGames() { // searchy search
    const search = searchInput.value.toLowerCase();
    console.log('Search term:', search); // debugging log
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('failure fetching games');
        }
        return response.json();
      })
      .then(data => {
        console.log('data:', data); // debugging log
        const filteredGames = data.games.filter(game => {
          return game.title.toLowerCase().includes(search) || game.genre.toLowerCase().includes(search);
        })
        console.log('filtered games:', filteredGames); // debugging log
        displayGames(filteredGames);
      })
      .catch(error => {
        console.error('error fetching games', error);
      });

  }

  searchInput.addEventListener('keypress', function(e) {  // activate search input on enter key press
    if (e.key === 'Enter') {
      console.log('enter key clicked') // checks if event is triggered
      searchGames();
    }
});
})
