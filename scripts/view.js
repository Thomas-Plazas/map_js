class View {

   // Constructeur
    constructor() {
        this.ctx = document.getElementById('canvas').getContext('2d');
    }

    get_ctx() {
        return this.ctx;
    }

    // Dessiner une tuile
    draw_tile(x, y, hextiles, img_x, img_y) {
      // Calcul du dessin des tuiles selon une cartographie fixe de 18x62 tuiles.
        this.get_ctx().drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x, y * 14, 32, 48);//18x62
    }

    // Dessiner un asset rivière / route
    draw_path(x, y, hextiles, img_x, img_y,angle) {
        this.get_ctx().save();
        let deplacement_x = x+16, deplacement_y= y*14+32;
        // move rotation center from origin to tile center
        this.get_ctx().translate(deplacement_x, deplacement_y);
        this.get_ctx().rotate(angle*Math.PI/180);
        // move back rotation center
        this.get_ctx().translate(-deplacement_x, -deplacement_y);
        this.get_ctx().drawImage(hextiles, img_x * 32, img_y * 48, 32, 48, x, y * 14, 32, 48);
        this.get_ctx().restore();
    }

    // Ecriture du nom d'une ville
    draw_text(x, y, text) {
        this.get_ctx().font = '20px BreatheFire';
        this.get_ctx().strokeStyle = "black";
        this.get_ctx().textAlign = "center";
        this.get_ctx().lineWidth = 4;
        this.get_ctx().strokeText(text, x + 18, y * 14 + 60);
        this.get_ctx().fillStyle = "white";
        this.get_ctx().fillText(text, x + 18, y * 14 + 60);
    }
}
