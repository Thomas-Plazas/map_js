class Grid {
    constructor() {
        this.map_H = 34;
        this.map_L = 18;
        this.tuiles = [];
        this.HEXTILES_IMAGE = new Image();
        this.set_hextiles_images();
    }

    set_hextiles_images() {
        this.HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3_borderless.png';
    }

    get_map_H() {
        return this.map_H;
    }

    get_map_L() {
        return this.map_L;
    }

    get_img_X(id) {
        return id % 8;
    }

    get_img_Y(id) {
        return parseInt(id / 8);
    }

    get_hextiles_images() {
        return this.HEXTILES_IMAGE;
    }

    get_tuiles() {
        return this.tuiles;
    }

    set_map_H(h){
        this.map_H = h;
    }

    set_map_L(l){
        this.map_L = l;
    }

    add_tuile(t) {
        this.tuiles.push(t);
    }

    bind_draw(callback){
        this.bind_draw_tuile = callback;
    }

    bind_refresh(callback){
        this.refresh = callback;
    }

    generate(){
        this.refresh();
        var value = [],
            hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (var y = 0; y < hauteur; y++) {
            value[y] = [];
            for (var x = 0; x < largeur; x++) {
                var deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48;
                var nx = x / largeur - 0.5, ny = y / hauteur - 0.5;
                var t = new Tuile(x, y);
                t.setElevation((noise.simplex2(nx,ny)+1)*2);
                t.setHumidity((noise.simplex2(nx,ny)+1)*2)
                this.add_tuile(t);
                value[y][x] = noise.simplex2(nx, ny);
                var id = Math.floor(Math.random() * 41);
                this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(id), this.get_img_Y(id));
            }
        }
    }
}
