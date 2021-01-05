var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3_borderless.png';


var hauteur = 20,largeur=10;

var inputH = document.getElementById("hauteur");
var inputL = document.getElementById("largeur");

inputH.addEventListener('change', function (){
   draw(inputH.value,inputL.value);
});
inputL.addEventListener('change', function (){
   draw(inputH.value,inputL.value);
});
function draw(hauteur,largeur){
   Promise.all([
       new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); })
   ])
   .then(() => {

         for(var j=0;j<hauteur;j++){
            for(var i=0;i<largeur;i++){
            var x;
            if(j%2==0){
               x=i*48+24;
            }
            else{
               x=i*48;
            }
            ctx.drawImage(HEXTILES_IMAGE,Math.floor(Math.random() * (7 - 0) )*32,0,32,52,x,j*14,32,52);
         }
      }
      //a
   });
}
