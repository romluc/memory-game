    // for easy version (9 cards)
    var iconArr_Easy = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube',
        'anchor', 'anchor', 'fixed'
      ],

      iconArr_Med = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube',
        'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o',
        'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'
      ],

      iconArr_Hard = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube',
        'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o',
        'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond',
        'bus', 'bus', 'rocket', 'rocket', 'ship', 'ship', 'truck', 'truck'
      ],


      // Set variables for a cleaner code
      gridCols = 0,
      gridRows = 0,
      level = 0,
      iconArr = iconArr_Easy,
      allCards = [],
      arrCenter = 0,
      arrLast = 0,
      openCards = [],
      match = 0,
      second = 0,
      moves = 0,
      wait = 500,
      card,
      nowTime,

      // Scoring system from 1 to 3 stars to shorten code
      stars3 = 14,
      stars2 = 16,
      star1 = 20;

    // Functions and eventListeners called as soon as the document is ready
    $(function() {
      $('.dropdown-item').click(chooseLevel);
      //buildDeck();
      $('.restart').click(restartGame);
    });

    function chooseLevel() {

      level = $(this).attr('id'); // Get the dropdown chosen level

      if (level === '1') {
        iconArr = iconArr_Easy;
        gridCols = 3;
        gridRows = 3;
      }
      if (level === '2') {
        iconArr = iconArr_Med;
        gridCols = 4;
        gridRows = 4;
      }
      if (level === '3') {
        iconArr = iconArr_Hard;
        gridCols = 5;
        gridRows = 5;
      }

      totalCard = Math.floor(iconArr.length / 2);
      arrCenter = Math.floor(iconArr.length / 2);

      buildDeck();
      initTime();
      $('.deck').find('.card').click(flipCard);
    }

    // O(n) version of Fisher–Yates shuffle (from https://bost.ocks.org/mike/shuffle/)
    function shuffle(array) {
      var m = array.length,
        t, i;
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }

    function swapFixedCard(input, arrCenter, fixedShuffled) {
        let temp = input[arrCenter];
        input[arrCenter] = input[fixedShuffled];
        input[fixedShuffled] = temp;
    }

    // Building the deck of cards
    function buildDeck() {
      // Shuffling the icons array items
      allCards = shuffle(iconArr);

      // For easy level, set fixed (card cannot be flipped) on the very center of the grid (design matters!)
      if (gridCols === 3) {
        let fixedShuffled = allCards.indexOf('fixed');
        console.log(fixedShuffled);
        console.log(allCards);
        swapFixedCard(allCards, arrCenter, fixedShuffled);
        console.log(allCards);
        console.log(arrCenter);
      }

      let n = 0; // the index to iterate allCards
      $('.deck').empty();

      // Upon start there are no matches nor moves
      match = 0;
      moves = 0;
      $('.moves').text('0');

      //Creates a bootstrap grid as a deck. Each card has its responsive container.
      for (let i = 0; i < gridRows; i++) {
        $('.deck').append($('<div class="row"></div>'));
        for (let j = 0; j < gridCols; j++) {
          $('.deck').append($('<div class="col-' + Math.floor(12 / gridCols) + ' container">' +
            '<li class="card"><i class="fa fa-' + allCards[n] + '"></i></li></div>'));
          n++;
          }
        }

        // Correcting the grid layout
        if (gridCols === 5) {
          let lastElt = $('.col-2').last().remove();
          lastElt.remove();
          $('.deck').find('.card').addClass('hard');
        }

      // Enables the timer to reset to 0 when the game is restarted
      resetTimer(nowTime);
      second = 0;
      $('.timer').text(`${second}`)
    }

    // Upon clicking, flips the chosen card open
    function flipCard() {

      let $this = $(this);

      // Unless under these conditions,
      // fixed card should be the center one when easy or hard modes are chosen (odd total number of cards)
      if ($this.hasClass('show') || $this.hasClass('match') || $this.html() === '<i class="fa fa-fixed"></i>') {
        return true;
      }

      card = $this.html();
      $this.addClass('open show');
      // The openCards array stores added cards facing up for the upcoming comparison with checkMatch function
      openCards.push(card);
      checkMatch();
    }

    // Checks the match for a open pair of cards. Function takes the currently open card and compares to any open card
    // in the openCards array.
    // If cards do not match, both cards are flipped back over.
    function checkMatch() {
      // Compares cards for matching
      if (openCards.length > 1) {
        if (card === openCards[0]) {
          $('.deck').find('.open').addClass('match');
          setTimeout(function() {
            $('.deck').find('open').removeClass('open show');
          }, wait);
          match++;
          // If cards don't match, there is a short delay, and the cards will turn back cover up
        } else {
          setTimeout(function() {
            $('.deck').find('.open').removeClass('open show');
          }, wait / 0.8);
        }
        // Emptying openCards for the next time the function is called
        openCards = [];
        // Incrementing the number of moves whenever two cards are compared
        moves++;
        // The number of moves is added to the rating() function that will determine the star score
        rating(moves);
        // The number of moves are added to the modal HTML alert
        $('.moves').html(moves);

        // Once all cards have been matched, modal is shown after a short delay
        if (totalCard === match) {
          console.log(totalCard);
          console.log(match);

          rating(moves);
          let score = rating(moves).score;
          setTimeout(function() {
            console.log('chamada funcao');
            gameOver(moves, score);
          }, 500);
        }
      }
    }

    // Adds a score from 1 to 3 stars depending on the amount of moves done
    function rating(moves) {
      let rating = 3;
      if (moves > stars3 && moves < stars2) {
        $('.fa-star').eq(3).removeClass('fa-star').addClass('fa-star-o');
      } else if (moves > stars2 && moves < star1) {
        $('.fa-star').eq(2).removeClass('fa-star').addClass('fa-star-o');
      } else if (moves > star1) {
        $('.fa-star').eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
      }
      return {
        score: rating
      };
    }

    // Adds boostrap modal alert window showing total time, moves and score
    function gameOver(moves, score) {
      $('#winnerText').text(`You needed ${moves} moves for a score of ${score}. Your time was ${second} seconds! ;)`);
      $('#winnerModal').modal('toggle');
    }

    // Clicking on the button located on the top right of the game, rebuilds deck and restart moves and time counters
    function restartGame() {
      $('.fa-star').removeClass('fa-star-o').addClass('fa-star');
      buildDeck();
      initTime();
      $('.deck').find('.card').click(flipCard);
    }

    function initTime() {
      nowTime = setInterval(function() {
        $('.timer').text(`${second}`)
        second = second + 1
      }, 1000);
    }

    // Resets the timer when the game ends or is restarted
    function resetTimer(timer) {
      if (timer) {
        clearInterval(timer);
      }
    }
