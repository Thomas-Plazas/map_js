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
