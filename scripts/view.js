class View {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    get_canvas() {
        return this.canvas;
    }

    get_ctx() {
        return this.ctx;
    }

    get_map_H() {
        return document.getElementById("hauteur");
    }

    get_map_L() {
        return document.getElementById("largeur");
    }

    set_map_H(val) {
        this.get_map_H().value = val;
    }

    set_map_L(val) {
        this.get_map_L().value = val;
    }

    draw_tuile(x, y, hextiles, img_x, img_y) {
        //this.ctx.drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x/2, y * 7, 16, 24);//36x
        this.ctx.drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x, y * 14, 32, 48);//18x62
    }
    draw_text(x,y,text) {
        this.ctx.font = "20px Arial";
        //this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text,x+18,y*14+60);
    }

    refresh(){
       this.get_ctx().clearRect(0, 0, this.get_canvas().width, this.get_canvas().height);
    }
}
