var canvas = document.getElementById('canvas'),
   ctx = canvas.getContext('2d'),
   hauteur = 20,
   largeur=10,
   inputH = document.getElementById("hauteur"),
   inputL = document.getElementById("largeur");

const HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3_borderless.png';
inputH.value = hauteur;
inputL.value = largeur;

inputH.addEventListener('change', function (){
   draw(parseInt(inputH.value), parseInt(inputL.value));
});

inputL.addEventListener('change', function (){
   draw(parseInt(inputH.value), parseInt(inputL.value));
});

Promise.all([
    new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); })
])
.then(() => {
      draw(hauteur, largeur);
   }
);

function draw(hauteur,largeur){
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   for(var j=0; j<hauteur; j++){
      for(var i=0;i<largeur;i++){
         var x=i*48;
         if(j%2==0){
            x=i*48+24;
         }
         drawTuile(x,j,Math.floor(Math.random() * (41 - 0))+0);
         //ctx.drawImage(HEXTILES_IMAGE,Math.floor(Math.random() * (7 - 0) )*32,0,32,52,x,j*14,32,52);

      }
   }
}

function getImgX(id){
   return id%8;
}
function getImgY(id){
   return parseInt(id/8);
}
function drawTuile(x,y,id){
   ctx.drawImage(HEXTILES_IMAGE,getImgX(id)*32,getImgY(id)*48,32,48,x,y*14,32,48);
}
