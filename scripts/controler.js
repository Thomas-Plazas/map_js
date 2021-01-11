var controler = {};

controler.init = function(){
  Promise.all([
      new Promise( (resolve) => {model.get_hextiles_images().addEventListener('load', () => { resolve();}); })
  ])
  .then(() => {
        controler.draw(hauteur, largeur);
     }
  );
}

controler.draw = function(hauteur,largeur){
  view.get_ctx().clearRect(0, 0, view.get_canvas().width, view.get_canvas().height);
  for(var j=0; j<hauteur; j++){
     for(var i=0;i<largeur;i++){
        var x=i*48;
        if(j%2==0){
           x=i*48+24;
        }
        view.draw_tuile(x,j,Math.floor(Math.random() * (41 - 0))+0);
     }
  }
}

controler.event_map_L = function(){
  view.get_map_L().addEventListener('change', function (){
     view.draw(parseInt(view.get_map_H().value), parseInt(view.get_map_L().value));
  });
}

controler.event_map_H = function(){
  view.get_map_H().addEventListener('change', function (){
     view.draw(parseInt(view.get_map_H().value), parseInt(view.get_map_L().value));
  });
}
