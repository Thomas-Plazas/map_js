class Controller {
   constructor(model, view) {
      this.model = model;
      this.view = view;
      var ctrl = this;
      this.view.get_map_L().addEventListener('change', function (){
         var h = parseInt(view.get_map_H().value),
             l = parseInt(view.get_map_L().value);
         ctrl.draw(h, l);
      });

      this.view.get_map_H().addEventListener('change', function (){
         var h = parseInt(view.get_map_H().value),
             l = parseInt(view.get_map_L().value);
         ctrl.draw(h, l);
      });
      this.view.set_map_H(this.model.get_map_H());
      this.view.set_map_L(this.model.get_map_L());
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
         for(var i=0; i<largeur; i++){
            var x = j%2 == 0 ? i*48+24 : i*48;
            // var x=i*48;
            // if(j%2==0){
            //    x=i*48+24;
            // }
            var id = Math.floor(Math.random() * (41 - 0))+0;
            this.view.draw_tuile(x, j, this.model.get_hextiles_images(), this.model.get_img_X(id), this.model.get_img_Y(id));
         }
      }
   }
}


$(document).ready(function() {
   const app = new Controller(new Model(), new View());
});
