var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3_borderless.png';
Promise.all([
    new Promise( (resolve) => {HEXTILES_IMAGE.addEventListener('load', () => { resolve();}); })
])
.then(() => {

      for(var j=0;j<30;j++){
         for(var i=0;i<10;i++){
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
