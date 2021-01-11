var view = {};

view.get_canvas = function (){
  return document.getElementById('canvas');
}

view.get_ctx = function (){
  return get_canvas().getContext('2d');
}

view.get_map_H = function (){
  return document.getElementById("hauteur");
}

view.get_map_L = function (){
  return document.getElementById("largeur");
}

view.draw_tuile = function(x,y,id){
     view.get_ctx().drawImage(HEXTILES_IMAGE,model.get_img_X(id)*32,model.get_img_Y(id)*48,32,48,x,y*14,32,48);
}
