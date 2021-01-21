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

    draw_tuile(x, y, hextiles, img_x, img_y) {
        //this.ctx.drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x/2, y * 7, 16, 24);//36x
        this.ctx.drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x, y * 14, 32, 48);//18x62
    }

    draw_river(x, y, hextiles, img_x, img_y,angle) {
        this.ctx.save();
        let depla_x = x+16, depla_y= y*14+32;
        //this.ctx.fillRect(depla_x, depla_y, 1, 1);
        this.ctx.translate(depla_x, depla_y);
        this.ctx.rotate(angle*Math.PI/180);
        this.ctx.translate(-depla_x, -depla_y);
        this.ctx.drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x, y * 14, 32, 48);
        this.ctx.restore();
    }

    draw_text(x, y, text) {

        this.ctx.font = '20px BreatheFire';
        this.ctx.strokeStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.lineWidth = 4;
        this.ctx.strokeText(text, x + 18, y * 14 + 60);
        //this.ctx.fillStyle = "red";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, x + 18, y * 14 + 60);
    }

    refresh() {
        this.get_ctx().clearRect(0, 0, this.get_canvas().width, this.get_canvas().height);
    }
}
