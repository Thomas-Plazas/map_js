class Controller {
   constructor(model, view) {
      this.model = model;
      this.view = view;
      this.view.get_map_L().addEventListener('change', function (){
         var h = parseInt(view.get_map_H().value),
             l = parseInt(view.get_map_L().value);
         draw(h, l); // faut trouvé comment appeler le this de la classe
      });

      this.view.get_map_H().addEventListener('change', function (){
         var h = parseInt(view.get_map_H().value),
             l = parseInt(view.get_map_L().value);
         draw(h, l); // faut trouvé comment appeler le this de la classe
      });
      this.init();
   }

   init(){
      Promise.all([
         new Promise( (resolve) => {
            this.model.get_hextiles_images().addEventListener('load', () => {
               resolve();
            });
         })
      ])
      .then(() => {
         this.draw(this.view.get_map_L().value, this.view.get_map_L().value);
      });
   }

   draw(hauteur, largeur){
      this.view.get_ctx().clearRect(0, 0, this.view.get_canvas().width, this.view.get_canvas().height);
      for(var j=0; j<hauteur; j++){
         for(var i=0;i<largeur;i++){
            var x=i*48;
            if(j%2==0){
               x=i*48+24;
            }
            //draw_tuile(x, y, hextiles, img_y, img_x){
            var id = Math.floor(Math.random() * (41 - 0))+0;
            this.view.draw_tuile(x, j, this.model.get_hextiles_images(), this.model.get_img_X(id), this.model.get_img_Y(id));
         }
      }
   }
}


$(document).ready(function() {
   const app = new Controller(new Model(), new View());
});
