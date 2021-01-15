class Grid {
    constructor() {
        this.map_H = 62;
        this.map_L = 18;
        this.tuiles = [];
        this.tuile_tab = [];
        this.town = [];
        this.HEXTILES_IMAGE = new Image();
        this.set_hextiles_images();
    }

    set_hextiles_images() {
        this.HEXTILES_IMAGE.src = 'img/fantasyhextiles_v3.png';
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
    bind_draw_text(callback){
        this.bind_draw_t = callback;
    }

    generate(){
        this.refresh();
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            this.tuile_tab[y] = [];
            for (let x = 0; x < largeur; x++) {
                var nx = x / largeur - 0.5, ny = y / hauteur - 0.5,
                    t = new Tuile(x, y);

                this.tuile_tab[y][x] = t;
                var gen = new SimplexNoise(),
                    gen2 = new SimplexNoise(),
                    e = gen.noise2D(nx, ny) / 2 + 0.5,
                    h = gen2.noise2D(nx, ny) / 2 + 0.5,
                    d = Math.sqrt(nx*nx + ny*ny) / Math.sqrt(0.2);

                e = (2 + e - d*2) / 2.85;
                t.setElevation(e);
                t.setHumidity(h);
                this.add_tuile(t);
            }
        }
        this.find_voisins();
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let tuile = this.tuile_tab[y][x];
                tuile.fill_holes();
            }
        }
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let tuile = this.tuile_tab[y][x];
                tuile.littoral();
            }
        }
        this.add_town(0.005);
        this.draw();
        this.add_asset(0.1, 33, 0);
        this.add_asset(0.02, 38, 6);
        this.drawNameTown();


    }

    find_voisins(){
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let tuile = this.tuile_tab[y][x],
                    voisins = [];
                if(y === 0){
                    if(x === 0){
                        voisins.push(this.tuile_tab[y+1][x]);
                        voisins.push(this.tuile_tab[y+2][x]);
                        voisins.push(this.tuile_tab[y+1][x+1]);
                    }
                    else if(x === largeur-1){
                        voisins.push(this.tuile_tab[y+1][x]);
                        voisins.push(this.tuile_tab[y+2][x]);
                    }
                    else{
                        voisins.push(this.tuile_tab[y+1][x]);
                        voisins.push(this.tuile_tab[y+2][x]);
                        voisins.push(this.tuile_tab[y+1][x+1]);
                        voisins.push(this.tuile_tab[y+1][x]);
                        voisins.push(this.tuile_tab[y+2][x]);
                    }
                }
                else if(y === hauteur -1){
                    if(x === 0){
                        voisins.push(this.tuile_tab[y-2][x]);
                        voisins.push(this.tuile_tab[y-1][x]);
                    }
                    else if(x === largeur-1){
                        voisins.push(this.tuile_tab[y-2][x]);
                        voisins.push(this.tuile_tab[y-1][x-1]);
                        voisins.push(this.tuile_tab[y-1][x]);
                    }
                    else{
                        voisins.push(this.tuile_tab[y-2][x]);
                        voisins.push(this.tuile_tab[y-1][x]);
                        voisins.push(this.tuile_tab[y-2][x]);
                        voisins.push(this.tuile_tab[y-1][x-1]);
                        voisins.push(this.tuile_tab[y-1][x]);
                    }
                }
                else{
                    if(x === 0){
                        voisins.push(this.tuile_tab[y-1][x]);
                        voisins.push(this.tuile_tab[y+1][x]);
                        if(y+2 < hauteur) voisins.push(this.tuile_tab[y+2][x]);
                        if(y-2 > 0) voisins.push(this.tuile_tab[y-2][x]);
                        if(y % 2 === 0){
                            voisins.push(this.tuile_tab[y+1][x+1]);
                            voisins.push(this.tuile_tab[y-1][x+1]);
                        }
                    }
                    else if(x === largeur -1){
                        voisins.push(this.tuile_tab[y-1][x]);
                        voisins.push(this.tuile_tab[y+1][x]);
                        if(y+2 < hauteur) voisins.push(this.tuile_tab[y+2][x]);
                        if(y-2 > 0) voisins.push(this.tuile_tab[y-2][x]);
                        if(y % 2 === 1){
                            voisins.push(this.tuile_tab[y+1][x-1]);
                            voisins.push(this.tuile_tab[y-1][x-1]);
                        }
                    }
                    else{
                        voisins.push(this.tuile_tab[y-1][x]);
                        voisins.push(this.tuile_tab[y+1][x]);
                        if(y % 2 === 0){
                            voisins.push(this.tuile_tab[y-1][x+1]);
                            voisins.push(this.tuile_tab[y+1][x+1]);
                        }
                        else{
                            voisins.push(this.tuile_tab[y-1][x-1]);
                            voisins.push(this.tuile_tab[y+1][x-1]);
                        }
                        if(y+2 < hauteur) voisins.push(this.tuile_tab[y+2][x]);
                        if(y-2 > 0) voisins.push(this.tuile_tab[y-2][x]);
                    }
                }

                tuile.setVoisins(voisins);
            }
        }
        /* test voisins
        var x_cor = 17;
        var y_cor = 24;
        this.tuile_tab[y_cor][x_cor].fill_holes();
        this.tuile_tab[y_cor][x_cor].setImageId(16);*/
    }

    add_asset(frequence, id_asset, id_tuile){
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
                    tuile = this.tuile_tab[y][x];

                if(frequence > Math.random() && tuile.getImageId() === id_tuile){
                    this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(id_asset), this.get_img_Y(id_asset));
                }
            }
        }
    }
    add_town(frequence){
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
                    tuile = this.tuile_tab[y][x];

                if(frequence > Math.random() && tuile.getImageId() !== 7){
                   if(tuile.getImageId() === 6){//LITORAL
                      //TODO Cas symétrique
                      tuile.setImageId(36);
                   }
                   else if (tuile.getElevation() < 0.75){//PLAINE
                      //TODO Cas des autre ville plaine
                      tuile.setImageId(8);
                   }
                   else if (tuile.getElevation() < 0.84){//NEIGE
                       //TODO Cas des autre ville neige
                      tuile.setImageId(22);
                   }
                    this.town.push(tuile);
                }
            }
        }
    }
    drawNameTown(){
        for (let i = 0; i < this.town.length; i++) {
                let deplacement = this.town[i].getY() % 2 === 0 ? this.town[i].getX() * 48 + 24 : this.town[i].getX() * 48,
                tuile = this.town[i];
                this.bind_draw_t(deplacement,tuile.getY(),"Grenoble");
         }

    }

    draw(){
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
                    tuile = this.tuile_tab[y][x];
                this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(tuile.getImageId()), this.get_img_Y(tuile.getImageId()));
            }
        }
    }
}
