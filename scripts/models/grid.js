class Grid {
    constructor() {
        this.map_H = 62;
        this.map_L = 18;
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

    set_map_H(h) {
        this.map_H = h;
    }

    set_map_L(l) {
        this.map_L = l;
    }

    bind_draw(callback) {
        this.bind_draw_tuile = callback;
    }

    bind_refresh(callback) {
        this.refresh = callback;
    }

    bind_draw_text(callback) {
        this.bind_draw_t = callback;
    }

    generate() {
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
                    gen3 = new SimplexNoise(),
                    e = gen.noise2D(nx, ny) / 2 + 0.5,
                    h = gen2.noise2D(nx, ny) / 2 + 0.5,
                    temp = gen3.noise2D(nx, ny) / 2 + 0.5,
                    d = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(0.2);

                e = (2 + e - d * 2) / 2.85;
                t.setTemperature(temp, false);
                t.setElevation(e, false);
                t.setHumidity(h);
            }
        }
        this.super_for(this.find_voisins);
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                let tuile = this.tuile_tab[y][x];
                //tuile.fill_holes();
            }
        }
        this.smooth_neighbors(1);
        this.smooth_neighbors(2);
        for(let i=0; i < 4; i++) this.smooth_neighbors(3);

        this.super_for(this.littoral)
        this.super_for(this.add_town, 0.005);
        this.super_for(this.add_river, 0.05);
        this.super_for(this.draw);
        this.super_for(this.add_asset, 0.05, 33, 0); // fleurs
        this.drawNameTown();


    }

    // factor double for loops to avoid duplicate code lines
    super_for(callback, frequence, id_asset, id_tuile){
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                callback(x, y, hauteur, largeur, frequence, id_asset, id_tuile);
            }
        }
    }

    littoral = (x, y) => {
        this.tuile_tab[y][x].littoral();
    }

    find_voisins = (x, y, hauteur, largeur) => {
        let tuile = this.tuile_tab[y][x],
            voisins = [];
        if (y === 0) {
            if (x === 0) {
                voisins.push(this.tuile_tab[y + 1][x]);
                voisins.push(this.tuile_tab[y + 2][x]);
                voisins.push(this.tuile_tab[y + 1][x + 1]);
            } else if (x === largeur - 1) {
                voisins.push(this.tuile_tab[y + 1][x]);
                voisins.push(this.tuile_tab[y + 2][x]);
            } else {
                voisins.push(this.tuile_tab[y + 1][x]);
                voisins.push(this.tuile_tab[y + 2][x]);
                voisins.push(this.tuile_tab[y + 1][x + 1]);
                voisins.push(this.tuile_tab[y + 1][x]);
                voisins.push(this.tuile_tab[y + 2][x]);
            }
        } else if (y === hauteur - 1) {
            if (x === 0) {
                voisins.push(this.tuile_tab[y - 2][x]);
                voisins.push(this.tuile_tab[y - 1][x]);
            } else if (x === largeur - 1) {
                voisins.push(this.tuile_tab[y - 2][x]);
                voisins.push(this.tuile_tab[y - 1][x - 1]);
                voisins.push(this.tuile_tab[y - 1][x]);
            } else {
                voisins.push(this.tuile_tab[y - 2][x]);
                voisins.push(this.tuile_tab[y - 1][x]);
                voisins.push(this.tuile_tab[y - 2][x]);
                voisins.push(this.tuile_tab[y - 1][x - 1]);
                voisins.push(this.tuile_tab[y - 1][x]);
            }
        } else {
            if (x === 0) {
                voisins.push(this.tuile_tab[y - 1][x]);
                voisins.push(this.tuile_tab[y + 1][x]);
                if (y + 2 < hauteur) voisins.push(this.tuile_tab[y + 2][x]);
                if (y - 2 > 0) voisins.push(this.tuile_tab[y - 2][x]);
                if (y % 2 === 0) {
                    voisins.push(this.tuile_tab[y + 1][x + 1]);
                    voisins.push(this.tuile_tab[y - 1][x + 1]);
                }
            } else if (x === largeur - 1) {
                voisins.push(this.tuile_tab[y - 1][x]);
                voisins.push(this.tuile_tab[y + 1][x]);
                if (y + 2 < hauteur) voisins.push(this.tuile_tab[y + 2][x]);
                if (y - 2 > 0) voisins.push(this.tuile_tab[y - 2][x]);
                if (y % 2 === 1) {
                    voisins.push(this.tuile_tab[y + 1][x - 1]);
                    voisins.push(this.tuile_tab[y - 1][x - 1]);
                }
            } else {
                if (y % 2 === 0) {
                    if (y - 2 > 0) voisins.push(this.tuile_tab[y - 2][x]);
                    voisins.push(this.tuile_tab[y - 1][x + 1]);
                    voisins.push(this.tuile_tab[y + 1][x + 1]);
                    if (y + 2 < hauteur) voisins.push(this.tuile_tab[y + 2][x]);
                    voisins.push(this.tuile_tab[y + 1][x]);
                    voisins.push(this.tuile_tab[y - 1][x]);
                } else {
                    if (y - 2 > 0) voisins.push(this.tuile_tab[y - 2][x]);
                    voisins.push(this.tuile_tab[y - 1][x]);
                    voisins.push(this.tuile_tab[y + 1][x]);
                    if (y + 2 < hauteur) voisins.push(this.tuile_tab[y + 2][x]);
                    voisins.push(this.tuile_tab[y + 1][x - 1]);
                    voisins.push(this.tuile_tab[y - 1][x - 1]);
                }
            }
        }
        tuile.setVoisins(voisins);
        /* test voisins
        var x_cor = 12;
        var y_cor = 15;
        this.tuile_tab[y_cor][x_cor].fill_holes();
        this.tuile_tab[y_cor][x_cor].setImageId(16);*/
    }

    smooth_neighbors(smooth_type) {
        var tabs = [];
        let hauteur = this.get_map_H(),
            largeur = this.get_map_L();
        for (let y = 0; y < hauteur; y++) {
            tabs[y] = [];
            for (let x = 0; x < largeur; x++) {
                let tuile = this.tuile_tab[y][x],
                    voisins = tuile.getVoisins(),
                    e_moy = 0,
                    h_moy = 0,
                    t_moy = 0;
                for (let i = 0; i < voisins.length; i++) {
                    e_moy += voisins[i].getElevation();
                    h_moy += voisins[i].getHumidity();
                    t_moy += voisins[i].getTemperature();
                }
                e_moy /= voisins.length;
                h_moy /= voisins.length;
                t_moy /= voisins.length;
                tabs[y][x] = {
                    tuile: tuile,
                    elev: e_moy,
                    humidity: h_moy,
                    temp: t_moy
                }
            }
        }
        for (let y = 0; y < hauteur; y++) {
            for (let x = 0; x < largeur; x++) {
                switch (smooth_type){
                    case 1:
                        tabs[y][x].tuile.setElevation(tabs[y][x].elev);
                        break;
                    case 2:
                        tabs[y][x].tuile.setHumidity(tabs[y][x].humidity);
                        break;
                    default:
                        tabs[y][x].tuile.setTemperature(tabs[y][x].temp);
                        break;
                }
            }
        }
    }

    add_asset = (x, y, hauteur, largeur, frequence, id_asset, id_tuile) => {
        let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
            tuile = this.tuile_tab[y][x];
        if (frequence > Math.random() && tuile.getImageId() === id_tuile) {
            this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(id_asset), this.get_img_Y(id_asset));
        }
    }

    add_town = (x, y, hauteur, largeur, frequence) => {
        let tuile = this.tuile_tab[y][x];
        if (0.05 > Math.random() && tuile.getImageId() === 6) {
            tuile.setImageId(38);
        }
        if (frequence > Math.random() && tuile.getImageId() !== 7) {
            if (tuile.getImageId() === 6) {//LITORAL
                let voisins = tuile.getVoisins();
                if (voisins[4].isNotSeaOrLittoral() || voisins[5].isNotSeaOrLittoral()) {
                    tuile.setImageId(36);
                } else if (voisins[2].isNotSeaOrLittoral() || voisins[1].isNotSeaOrLittoral()) {
                    tuile.setImageId(37);
                }
            } else if (tuile.getElevation() < 0.75) {//PLAINE
                let town = parseInt(Math.random() * 3) + 8;
                tuile.setImageId(town);
            } else if (tuile.getElevation() < 0.84) {//NEIGE
                let town = parseInt(Math.random() * 2) + 22;
                tuile.setImageId(town);
            }
            this.town.push(tuile);
        }
    }

    add_river = (x, y, hauteur, largeur, frequence) => {
        let tuile = this.tuile_tab[y][x];
        if(frequence > Math.random() && tuile.getElevation() > 0.7){
            let river = [tuile];
            tuile.setImageId(40);
            let river_tuiles = this.next_river(river);
            this.draw_river(river_tuiles);
        }
    }

    next_river(tuiles){
        let current = tuiles[tuiles.length-1];
        if(!current.isNotSeaOrLittoral()) return tuiles; // break condition
        if(tuiles.length !== 1) current.setImageId(42);
        let voisins = current.getVoisins(),
            min = 1,
            lower = current;
        for (let i = 0; i < voisins.length; i++) {
            let elev = voisins[i].getElevation();
            if(tuiles.indexOf(voisins[i]) === -1 && elev <= min){
                min = elev;
                lower = voisins[i];
            }
        }
        tuiles.push(lower)
        return this.next_river(tuiles);
    }

    draw_river(tuiles){
        for(let i=0; i < tuiles.length; i++){
            let tuile = tuiles[i],
                voisins = tuile.getVoisins(),
                x = tuile.getX(),
                y = tuile.getY(),
                deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
                next = voisins.indexOf(tuiles[i+1]);
            switch (next){
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                default:
                    break;
            }
            this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(33), this.get_img_Y(33));
        }
    }

    drawNameTown() {
        for (let i = 0; i < this.town.length; i++) {
            let deplacement = this.town[i].getY() % 2 === 0 ? this.town[i].getX() * 48 + 24 : this.town[i].getX() * 48,
                tuile = this.town[i];
            this.bind_draw_t(deplacement, tuile.getY(), "Grenoble");
        }

    }

    draw = (x, y) => {
        let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
            tuile = this.tuile_tab[y][x];
        this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(tuile.getImageId()), this.get_img_Y(tuile.getImageId()));
    }
}
