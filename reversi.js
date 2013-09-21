
(function() {
  var TILESTATE = {
    EMPTY: 0,
    WHITE: 1,
    BLACK: 2,
  };

  // Need a little convenience type, since there are no native tuples in js.
  var vector = function(x,y) {
    return {
      x: x,
      y: y,
      plus: function(v1,v2) {
        return vector(v1.x + v2.x, v1.y + v2.y);
      },
      toString: function() {
        return "("+x+","+y+")";
      }
    };
  };

  // Thought: the tuple of (current_board, new_tile, capturing_colour)
  // gets passed around together a lot.
  // It would be natural to group these together into a combined "Move" object.

  /** The list of pieces which would be captured by a given move.
    Board, vector, tile_state -> [vector].
    Non-mutating.
  */
  var captured_pieces = function(current_board,
      new_tile,
      capturing_colour)
  {
    // Walk in each direction as far as possible until hitting
    // either an empty space, or a piece of the same colour.
    // If the same colour, the intermediates would be captured.
    var captured_pieces_in_direction = function(delta) {
      var current_tile = new_tile;
      var traversed_tiles = [];

      while (true) {
        if (! current_tile in current_board ||
            current_board[current_tile] == TILESTATE.EMPTY) {
          return [];
        }
        if (current_board[current_tile] == capturing_colour) {
          return traversed_tiles;
        }
        traversed_tiles.push(current_tile);
        current_tile = current_tile.plus(delta);
      }
    };

    var deltas = [];
    [-1,0,1].forEach(function(x) {
        [-1,0,1].forEach(function(y) {
          if (x != 0 || y != 0) {
            deltas.push(vector(x,y));
          }
        });
    });

    return _.union(_.map(deltas, captured_pieces_in_direction));
  };

  /** A move is legal if the tile is empty, and a capture would result. */
  var is_legal_move = function(current_board, tile, capturing_colour) {
    return (current_board[tile] == TILESTATE.EMPTY) &&
           _.any(captured_pieces(current_board, tile, capturing_colour));
  };

  /** Update the board to account for a move to the given tile.
    Mutates the game board object, returning it back.
    Throws an exception if this is an illegal move.
  */
  var take_move = function(current_board, tile, capturing_colour) {
    if (! is_legal_move(current_board, tile, capturing_colour)) {
      throw "Illegal move at " + tile;
    }

    _.each(captured_pieces(current_board, tile, capturing_colour), function(piece) {
        current_board[piece] = capturing_colour;
    });
    current_board[tile] = capturing_colour;
  };

  var init_board = function(n) {
    var board = {};
    for(var x=0; x < n; ++x) {
      for(var y=0; y < n; ++y) {
        board[vector(x,y)] = TILESTATE.EMPTY;
      }
    }

    // Init middle guys.
    var floor = Math.floor;
    board[vector(floor(n/2) - 1,  floor(n/2) - 1)]  = TILESTATE.WHITE;
    board[vector(floor(n/2) - 1,  floor(n/2))]      = TILESTATE.BLACK;
    board[vector(floor(n/2),      floor(n/2) - 1)]  = TILESTATE.BLACK;
    board[vector(floor(n/2),      floor(n/2))]      = TILESTATE.WHITE;

    board.width = n;
    return board;
  };

  window.board = init_board(8);

  var dump_board = function(board) {
    for(y=0; y < board.width; ++y) {
      var row = [];
      for(x=0; x < board.width; ++x) {
        row.push(board[vector(x,y)]);
      }
      console.log("-- " + row.join(' '));
    }
  };

  dump_board(window.board);
})();

