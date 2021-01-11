class Model {
   constructor() {
      this.map_H = 10;
      this.map_L = 10;
      this.HEXTILES_IMAGE = new Image();
      this.set_hextiles_images();
   }

   set_hextiles_images(){
      this.HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3_borderless.png';
   }

   get_map_H(){
      return this.map_H;
   }

   get_map_L(){
      return this.map_L;
   }
   
   get_img_X(id){
      return id%8;
   }

   get_img_Y(id){
      return parseInt(id/8);
   }

   get_hextiles_images(){
      return this.HEXTILES_IMAGE;
   }

}
