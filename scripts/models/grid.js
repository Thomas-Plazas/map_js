class Grid {
    constructor() {
        this.map_H = 62;
        this.map_L = 18;
        this.tuile_tab = [];
        this.town = [];
        this.river = [];
        this.town_path = [];
        this.HEXTILES_IMAGE = new Image();
        this.HEXTILES_RIVER = new Image();
        this.HEXTILES_RIVER.src = 'img/fantasyhextiles_randr_4_v2.png';
        this.set_hextiles_images('img/fantasyhextiles_v3.png');
        this.town_names = ["Frignac", "Coatmeur", "Goasvoen", "Revonnas", "Aumare", "Moliets", "Naville", "Choriot", "Viterbe",
            "Lespart", "Marcilly", "Chaussoy", "Cabrier", "Escots", "Ladoux", "Maroncourt", "Auxais", "Cramait", "Chambly",
            "Milaria", "Ruffec", "Meillon", "Limé", "Clussais", "Mienval"]
    }

    set_hextiles_images(src) {
        this.HEXTILES_IMAGE.src = src;
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

    bind_draw_river(callback) {
        this.draw_river = callback;
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
        for (let i = 0; i < 4; i++) this.smooth_neighbors(3);

        this.super_for(this.littoral)
        this.super_for(this.add_river, 0.07);
        this.super_for(this.add_town, 0.005);
        if(this.town.length > 1) this.setTownPath();
        this.super_for(this.draw);
        //this.super_for(this.add_asset, 0.05, 33, 0); // fleurs
        this.set_river();
        this.drawNameTown();


    }

    // factor double for loops to avoid duplicate code lines
    super_for(callback, frequence, id_asset, id_tuile) {
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
                switch (smooth_type) {
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
        if (this.river.indexOf(tuile) !== -1) return; // si on est sur une tuile de river
        if (0.05 > Math.random() && tuile.getImageId() === 6) {
            tuile.setImageId(38);
        }
        let voisins = tuile.getVoisins();
        for (let i = 0; i < voisins.length; i++) {
            if (this.town.indexOf(voisins[i]) !== -1) return;
        }
        if (frequence > Math.random() && tuile.getImageId() !== 7 && tuile.getVoisins().length === 6) {
            if (tuile.getImageId() === 6) {//LITORAL
                let voisins = tuile.getVoisins();
                if (voisins[4].isNotSeaOrLittoral() || voisins[5].isNotSeaOrLittoral()) {
                    tuile.setImageId(36);
                    this.town.push(tuile);
                } else if (voisins[2].isNotSeaOrLittoral() || voisins[1].isNotSeaOrLittoral()) {
                    tuile.setImageId(37);
                    this.town.push(tuile);
                }
            } else if (tuile.getElevation() < 0.68) {//PLAINE
                if (tuile.getTemperature() < 0.44) {//DESERT
                    let town = parseInt(Math.random() * 2) + 30;
                    tuile.setImageId(town);
                    this.town.push(tuile);
                } else {//NORMALE //SAVANE
                    let town = parseInt(Math.random() * 3) + 8;
                    tuile.setImageId(town);
                    this.town.push(tuile);
                }
            } else {//NEIGE
                let town = parseInt(Math.random() * 2) + 22;
                tuile.setImageId(town);
                this.town.push(tuile);
            }

        }
    }

    add_river = (x, y, hauteur, largeur, frequence) => {
        let tuile = this.tuile_tab[y][x];
        if (frequence > Math.random() && tuile.getElevation() > 0.7 && tuile.getElevation() < 0.805) {
            let river = [tuile];
            this.next_river(river);
        }
    }

    next_river(tuiles) {
        let current = tuiles[tuiles.length - 1],
            e = current.getElevation(),
            t = current.getTemperature();

        // MER
        if (e < 0.24) {
            //current.setImageId(7);
        }
        // Plaine
        else if (e < 0.68) {
            if (t < 0.44) {//DESERT
                current.setImageId(24);
            } else if (t < 0.49) {//SAVANE
                current.setImageId(14);
            } else if (t < 0.7) {//NORMALE
                current.setImageId(0);
            }
        }
        // Neige
        else if (e < 0.805) {
            current.setImageId(16);
        }
        // Montagne
        else {
            current.setImageId(5);
        }

        this.river.push(current);//Ajout de la tuile à la liste de rivière
        if (!current.isNotSeaOrLittoral()) {
            return tuiles; // break condition
        }
        //if (tuiles.length !== 1) current.setImageId(42);
        let voisins = current.getVoisins(),
            min = 1,
            lower = current;
        for (let i = 0; i < voisins.length; i++) {
            let elev = voisins[i].getElevation();
            if (tuiles.indexOf(voisins[i]) === -1 && elev <= min) {
                min = elev;
                lower = voisins[i];
            }
        }
        tuiles.push(lower)
        return this.next_river(tuiles);
    }

    set_river() {
        for (let i = 0; i < this.river.length; i++) {
            let current = this.river[i],
                index_of_previous_voisins = i !== 0 ? current.getVoisins().indexOf(this.river[i - 1]) : false;
            if (i === 0 || index_of_previous_voisins === -1) {//SI pas de précédent
                this.setRiverImage(-1, current, current.getVoisins().indexOf(this.river[i + 1]));
            } else if (i === this.river.length || current.getVoisins().indexOf(this.river[i + 1]) === -1) { // Si pas de suivant
                this.setRiverImage(current.getVoisins().indexOf(this.river[i - 1]), current, -1);
            } else {// Cas global
                this.setRiverImage(current.getVoisins().indexOf(this.river[i - 1]), current, current.getVoisins().indexOf(this.river[i + 1]));
            }
        }
    }


    setRiverImage(previous, current, next) {
        let deplacement = current.getY() % 2 === 0 ? current.getX() * 48 + 24 : current.getX() * 48,
            id, angle = 0;
        if (previous === -1) { // depart
            switch (next) {
                case 0:
                    id = 17;
                    angle = 300;
                    break;
                case 1:
                    id = 17;
                    break;
                case 2:
                    id = 18;
                    break;
                case 3:
                    id = 17;
                    angle = 300;
                    break;
                case 4:
                    id = 17;
                    break;
                default:
                    id = 18;
                    break;
            }
        } else if (next === -1) { // arrivée
            return;
        } else {
            if (previous === 0) {
                if (next === 1) {
                    id = 19;
                    angle = 120;
                } else if (next === 2) {
                    id = 22;
                    angle = 60;
                } else if (next === 3) {
                    id = 17;
                    angle = 300;
                } else if (next === 4) {
                    id = 21;
                    angle = 120;
                } else {
                    id = 19;
                    angle = 60;
                }
            } else if (previous === 1) {
                if (next === 0) {
                    id = 19;
                    angle = 120;
                } else if (next === 2) {
                    id = 19;
                    angle = 180;
                } else if (next === 3) {
                    id = 21;
                    angle = 300;
                } else if (next === 4) {
                    id = 17;
                    angle = 0;
                } else {
                    id = 22;
                }
            } else if (previous === 2) {
                if (next === 0) {
                    id = 21;
                    angle = 240;
                } else if (next === 1) {
                    id = 20;
                    angle = 0;
                } else if (next === 3) {
                    id = 19;
                    angle = 240;
                } else if (next === 4) {
                    id = 21;
                    angle = 0;
                } else {
                    id = 18;
                    angle = 0;
                }
            } else if (previous === 3) {
                if (next === 0) {
                    id = 17;
                    angle = 300;
                } else if (next === 1) {
                    id = 21;
                    angle = 300;
                } else if (next === 2) {
                    id = 19;
                    angle = 240;
                } else if (next === 4) {
                    id = 19;
                    angle = 300;
                } else {
                    id = 21;
                    angle = 60;
                }
            } else if (previous === 4) {
                if (next === 0) {
                    id = 22;
                    angle = -60;
                } else if (next === 1) {
                    id = 17;
                } else if (next === 2) {
                    id = 21;
                } else if (next === 3) {
                    id = 19;
                    angle = 300;
                } else {
                    id = 19;
                }
            } else {
                if (next === 0) {
                    id = 19;
                    angle = 60;
                } else if (next === 1) {
                    id = 22;
                } else if (next === 2) {
                    id = 18;
                } else if (next === 3) {
                    id = 21;
                    angle = 60;
                } else {
                    id = 19;
                }
            }
        }

        this.draw_river(deplacement, current.getY(), this.HEXTILES_RIVER, this.get_img_X(id), this.get_img_Y(id), angle);
    }

    drawNameTown() {
        for (let i = 0; i < this.town.length; i++) {
            let deplacement = this.town[i].getY() % 2 === 0 ? this.town[i].getX() * 48 + 24 : this.town[i].getX() * 48,
                tuile = this.town[i];
            let numero_ville = Math.floor(Math.random() * (this.town_names.length));
            this.bind_draw_t(deplacement, tuile.getY(), this.town_names[numero_ville]);
            this.town_names.splice(numero_ville, 1);
        }
    }

    setTownPath() {
        for (let i = 0; i < 1/*this.town.length*/; i++) {
            let depart = this.town[i], arrive = this.town[i+1];
            if (!arrive){ // fin de boucle arrive n'existe pas
                depart = this.town[this.town.length - 1];
                arrive = this.town[0];
                return;
            }
            else{
                this.nextPath(depart, arrive, 0);
                this.town_path.push(depart);
            }
        }
    }

    nextPath(depart, arrive, count) {
        if(count === 3) return;
        let voisins = depart.getVoisins(),
            current = voisins[0],
            x_dep = depart.getX(), y_dep = depart.getY(),
            x_arr = arrive.getX(), y_arr = arrive.getY(),
            cost = this.getCost(current.getImageId());
        for (let i = 1; i < voisins.length; i++) {
            //si arrive.x - depart.x < arrive.x - depart -x
            // Plus petit cost
            let x_curr = voisins[i].getX(), y_curr = voisins[i].getY();
            let d_x = (x_arr - x_dep) - (x_arr - x_curr),
                d_y = (y_arr - y_dep) - (y_arr - y_curr),
                cost_current = this.getCost(voisins[i].getImageId()) + 2*d_x + 2*d_y;
                console.log(d_x, d_y, cost_current, cost);
            if(cost_current <= cost && voisins[i].isNotSeaOrLittoral()){
                current = voisins[i];
                cost = cost_current;
            }
        }
        current.setImageId(40);
        console.log(depart === current);
        this.town_path.push(current);
        if (current !== arrive) {
            this.nextPath(current, arrive, count + 1);
        }
    }

    getCost(id) {
        if (id === 0 || id === 16 || id === 24 || id === 14) {
            return 1;
        } else if (id === 1 || id === 13 || id === 26 || id === 17) {
            return 2;
        } else if (id === 2 || id === 12 || id === 18) {
            return 3;
        } else if (id === 3 || id === 4 || id === 19 || id === 20 || id === 25) {
            return 4;
        } else {
            return 100;
        }
    }

    draw = (x, y) => {
        let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
            tuile = this.tuile_tab[y][x];

        this.bind_draw_tuile(deplacement, y, this.get_hextiles_images(), this.get_img_X(tuile.getImageId()), this.get_img_Y(tuile.getImageId()));
    }
}
