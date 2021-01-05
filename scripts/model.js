var model = {};
model.map_H = "";
model.map_L = "";
model.HEXTILES_IMAGE = new Image();

model.set_hextiles_images = function(){
  model.HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3_borderless.png';
}

model.get_map_H = function(){
  return view.get_map_H().value;
}

model.get_map_L = function(){
  return view.get_map_L().value;
}

model.get_img_X = function (id){
   return id%8;
}
model.get_img_Y = function (id){
   return parseInt(id/8);
}
