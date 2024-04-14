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
  const commentFormContainer = document.getElementById('comment-form'); 

  let loggedIn = false; 

  function fetchGames() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
              throw new Error('failure fetching games');
            }
            return response.json();
        })
        .then(data => {
            displayGames(data);
        })
        .catch(error => {
            console.error('error fetching games', error);
        });
  }
  fetchGames();

  function displayGames(games) {
    gameContainer.innerHTML = '';
    games.forEach(game => {
        const gameCard = createGameCard(game);
        gameContainer.appendChild(gameCard);
    })
  };

  function createGameCard(game) {
    const { title, thumbnail, genre, short_des } = game;

    const gameCard = document.createElement('div');
    gameCard.classList.add('game-card');

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
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
    gameCard.appendChild(genreId);

    const description = document.createElement('p');
    description.textContent = short_des;
    gameCard.appendChild(description);

    const favouriteButton = document.createElement('button');
    favouriteButton.innerHTML = '&#10084;';
    favouriteButton.classList.add('favourite-button');
    favouriteButton.addEventListener('click', function() {
        if (loggedIn) {
            console.log('favourite button clicked for game:', game['title']);
            favouriteButton.style.color = favouriteButton.style.color === 'red' ? 'grey' : 'red';
        } 
        else {
            alert('please login to like the game.');
          }
    });
    gameCard.appendChild(favouriteButton);

    const commentButton = document.createElement('button');
    commentButton.innerHTML = '&#128172;';
    commentButton.classList.add('comment-button');
    commentButton.addEventListener('click', function() {
        if (loggedIn) {
            openCommentModal(game);
        } 
        else {
            alert('please login to comment on the game.');
        }
    });
    gameCard.appendChild(commentButton);

    return gameCard;
  }

  function openCommentModal(game) {
    commentFormContainer.innerHTML = ''; // clear previous content
    const commentForm = document.createElement('form');
    const commentInput = document.createElement('textarea');
    commentInput.setAttribute('placeholder', 'write your comment here...');
    const commentSubmitButton = document.createElement('button');
    commentSubmitButton.textContent = 'submit';
    commentSubmitButton.type = 'submit';

    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const commentText = commentInput.value.trim();
        if (commentText !== '') { // add code to submit the comment to the server
        console.log(`comment submitted for game "${game['title']}": ${commentText}`); // display the comment on the page if needed
        } 
        else {
            alert('please enter a comment before submitting.');
        }
    });

    commentForm.appendChild(commentInput);
    commentForm.appendChild(commentSubmitButton);
    commentFormContainer.appendChild(commentForm);

    loginModal.style.display = 'block'; // display the modal with comment form
  }

  favourite.addEventListener('click', () => {
    console.log('favourite button clicked');
  })

  function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
        modal.style.zIndex = '1000'; // ensure the login modal is above other elements
    } 
    else {
        modal.style.display = 'none';
    }
  }
  login.addEventListener('click', () => {
    toggleModal('modal');
  });

  closeLoginModal.addEventListener('click', () => {
    toggleModal('modal');
  });

  window.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        toggleModal('modal');
      }
  });

  loginModalButton.addEventListener('click', () => {
      console.log('login button clicked');
      loggedIn = true; // set loggedIn to true when login button is clicked
      toggleModal('modal'); // hide the login modal
  });

  signupModalButton.addEventListener('click', () => {
      console.log('sign up button clicked');
      loggedIn = true; // set loggedIn to true when sign up button is clicked
      toggleModal('modal'); // hide the login modal
  });

  login.addEventListener('click', () => {
    loginModal.style.display = 'block';
    loginModal.style.zIndex = '1000'; // ensure the modal is above other elements
  });

  function searchGames() {
    const search = searchInput.value.toLowerCase().trim();
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
            throw new Error('failure searching games');
            }
            return response.json();
        })
        .then(data => {
            const filteredGames = data.games.filter(game => {
                return game.title.toLowerCase().includes(search) || game.genre.toLowerCase().includes(search);
            });
            if(filteredGames.length === 0) {
                alert('game not found');
            }
            else {
                displayGames(filteredGames);
            }
        })
        .catch(error => {
            console.error('error fetching games:', error);
        });
  }
  
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // checks to see if enter is pressed
        e.preventDefault(); // prevents form submission
        searchGames();
    }
  });
});