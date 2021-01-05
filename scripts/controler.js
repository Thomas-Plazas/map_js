var controler = {};

controler.init = function(){

}

controler.draw_tuile = function(x,y,id){
     view.get_ctx().drawImage(HEXTILES_IMAGE,model.get_img_X(id)*32,model.get_img_Y(id)*48,32,48,x,y*14,32,48);
}

// controler.event_map_L = function(){
//   model.get_map_L().addEventListener('change', function (){
//      draw(parseInt(inputH.value), parseInt(inputL.value));
//   });
// }
//
// inputH.addEventListener('change', function (){
//    draw(parseInt(inputH.value), parseInt(inputL.value));
// });
//
// inputL.addEventListener('change', function (){
//    draw(parseInt(inputH.value), parseInt(inputL.value));
// });
//
// Promise.all([
//     new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); })
// ])
// .then(() => {
//       draw(hauteur, largeur);
//    }
// );

controler.draw = function(hauteur,largeur){
  view.get_ctx().clearRect(0, 0, view.get_canvas().width, view.get_canvas().height);
  for(var j=0; j<hauteur; j++){
     for(var i=0;i<largeur;i++){
        var x=i*48;
        if(j%2==0){
           x=i*48+24;
        }
        controler.draw_tuile(x,j,Math.floor(Math.random() * (41 - 0))+0);
        //ctx.drawImage(HEXTILES_IMAGE,Math.floor(Math.random() * (7 - 0) )*32,0,32,52,x,j*14,32,52);

     }
  }
}
