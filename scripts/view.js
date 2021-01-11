class View {
   constructor() {
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
   }

   get_canvas(){
      return this.canvas;
   }

   get_ctx(){
      return this.ctx;
   }
   get_map_H(){
      return document.getElementById("hauteur");
   }
   get_map_L(){
      return document.getElementById("largeur");
   }
   set_map_H(val){
      this.get_map_H().value = val;
   }
   set_map_L(val){
      this.get_map_L().value = val;
   }
   draw_tuile(x, y, hextiles, img_x, img_y){
      //this.ctx.drawImage(model.get_hextiles_images(), model.get_img_X(id)*32, model.get_img_Y(id)*48, 32, 48, x, y*14, 32, 48);
      this.ctx.drawImage(hextiles, img_x*32, img_y*48, 32, 48, x, y*14, 32, 48);
   }
}
