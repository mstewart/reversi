var render = function(board){

   var render_tile = function(colour){
    var source = $("tile-template").html();
    var template = Handlebars.compile(source);
    var context = { colour: colour };
    return template(context);
   };

   for(var x = 0; x < board.width; x++){
    for(var y = 0; y < board.width; y++){

    }
   }

};
