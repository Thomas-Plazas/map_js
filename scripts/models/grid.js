class Grid {

   // Constructeur
    constructor() {
        this.map_height = 62;
        this.map_width = 18;
        this.grid = [];
        this.river_path = [];
        this.town = [];
        this.town_path = [];
        this.town_names = ["Frignac", "Coatmeur", "Goasvoen", "Revonnas", "Aumare", "Moliets", "Naville", "Choriot", "Viterbe",
            "Lespart", "Marcilly", "Chaussoy", "Cabrier", "Escots", "Ladoux", "Maroncourt", "Auxais", "Cramait", "Chambly",
            "Milaria", "Ruffec", "Meillon", "Limé", "Clussais", "Mienval"]
        this.HEXTILES_IMAGE = new Image();
        this.HEXTILES_PATH = new Image();
        this.HEXTILES_PATH.src = 'img/fantasyhextiles_randr_4_v2.png';
        this.set_hextiles_images('img/fantasyhextiles_v3_borderless.png');
    }

    // Source des tuiles
    get_hextiles_images() {
        return this.HEXTILES_IMAGE;
    }

    set_hextiles_images(src) {
        this.HEXTILES_IMAGE.src = src;
    }

    // Dimensions de la carte
    get_map_height() {
        return this.map_height;
    }

    get_map_width() {
        return this.map_width;
    }

    // Position de l'image
    get_img_x(id) {
        return id % 8;
    }

    get_img_y(id) {
        return parseInt(id / 8);
    }

    // Binding des draw
    bind_draw_tile(callback) {
        this.draw_tile = callback;
    }

    bind_draw_text(callback) {
        this.draw_text = callback;
    }

    bind_draw_path(callback) {
        this.draw_path = callback;
    }


    generate() {
        let height = this.get_map_height(),
            width = this.get_map_width();

         // Parcours de la carte
        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < width; x++) {
               // Génération des paramètres de la carte
                let nx = x / width - 0.5, ny = y / height - 0.5,
                    t = new Tile(x, y);
                this.grid[y][x] = t;
                let gen = new SimplexNoise(),
                    gen2 = new SimplexNoise(),
                    gen3 = new SimplexNoise(),
                    elevation = gen.noise2D(nx, ny) / 2 + 0.5,
                    humidity = gen2.noise2D(nx, ny) / 2 + 0.5,
                    temperature = gen3.noise2D(nx, ny) / 2 + 0.5,
                    distance = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(0.2);

                elevation = (2 + elevation - distance * 2) / 2.85;
                t.set_temperature(temperature, false);
                t.set_elevation(elevation, false);
                t.set_humidity(humidity);
            }
        }

        // Paramétrage des biomes
        this.super_for(this.find_neighbors);
        this.smooth_neighbors(1); // elevation
        this.smooth_neighbors(2); // humidity
        for (let i = 0; i < 4; i++) this.smooth_neighbors(3); // temperature

        // Ajout du littoral, des rivières, des villes et des routes
        this.super_for(this.littoral)
        this.super_for(this.add_rivers, 0.07);
        this.super_for(this.add_towns, 0.005);
        this.super_for(this.draw_grid);
        this.draw_river();
        if (this.town.length > 1) {
            this.set_town_path();
            this.draw_town_path();
        }
        this.draw_town_name();
        this.super_for(this.add_asset, 0.05, 33, 0); // flowers PLAINE
        this.super_for(this.add_asset, 0.1, 34, 16); // flowers NEIGE
        this.super_for(this.add_asset, 0.1, 35, 24); // flowers SAVANE

    }

    // Facteur des doubles pour éviter la duplication des lignes de codes
    super_for(callback, frequency, id_asset, id_tile) {
        let height = this.get_map_height(),
            width = this.get_map_width();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                callback(x, y, height, width, frequency, id_asset, id_tile);
            }
        }
    }

    // Recherche des voisins de la tuile courante
    find_neighbors = (x, y, height, width) => {
        let tile = this.grid[y][x],
            neighbors = [];
         // Tuiles les plus en haut de la carte (x,0)
        if (y === 0) {
            // Tuile dans le coin haut gauche (0,0)
            if (x === 0) {
                neighbors.push(this.grid[y + 1][x]);
                neighbors.push(this.grid[y + 2][x]);
                neighbors.push(this.grid[y + 1][x + 1]);
            }
            // Tuile dans le coin haut droit (max,0)
            else if (x === width - 1) {
                neighbors.push(this.grid[y + 1][x]);
                neighbors.push(this.grid[y + 2][x]);
            } else {
                neighbors.push(this.grid[y + 1][x]);
                neighbors.push(this.grid[y + 2][x]);
                neighbors.push(this.grid[y + 1][x + 1]);
                neighbors.push(this.grid[y + 1][x]);
                neighbors.push(this.grid[y + 2][x]);
            }
        }
       //Tuiles les plus en bas de la carte (x,max)
        else if (y === height - 1) {
           // Tuile dans le coin bas gauche (0,max)
            if (x === 0) {
                neighbors.push(this.grid[y - 2][x]);
                neighbors.push(this.grid[y - 1][x]);
            // Tuile dans le coin bas droit (max,max)
            } else if (x === width - 1) {
                neighbors.push(this.grid[y - 2][x]);
                neighbors.push(this.grid[y - 1][x - 1]);
                neighbors.push(this.grid[y - 1][x]);
            } else {
                neighbors.push(this.grid[y - 2][x]);
                neighbors.push(this.grid[y - 1][x]);
                neighbors.push(this.grid[y - 2][x]);
                neighbors.push(this.grid[y - 1][x - 1]);
                neighbors.push(this.grid[y - 1][x]);
            }
        }
        // Tuiles lambda (x,y)
        else {
           // Tuile en bord gauche de la carte (0,y)
            if (x === 0) {
                neighbors.push(this.grid[y - 1][x]);
                neighbors.push(this.grid[y + 1][x]);
                if (y + 2 < height) neighbors.push(this.grid[y + 2][x]);
                if (y - 2 > 0) neighbors.push(this.grid[y - 2][x]);
                if (y % 2 === 0) {
                    neighbors.push(this.grid[y + 1][x + 1]);
                    neighbors.push(this.grid[y - 1][x + 1]);
                }
            // Tuile en bord droit de la carte (max,y)
            } else if (x === width - 1) {
                neighbors.push(this.grid[y - 1][x]);
                neighbors.push(this.grid[y + 1][x]);
                if (y + 2 < height) neighbors.push(this.grid[y + 2][x]);
                if (y - 2 > 0) neighbors.push(this.grid[y - 2][x]);
                if (y % 2 === 1) {
                    neighbors.push(this.grid[y + 1][x - 1]);
                    neighbors.push(this.grid[y - 1][x - 1]);
                }
            // Tuile en bord droit de la carte (max,y)
            } else {
               // Tuile sur une ligne paire (x,y pair)
                if (y % 2 === 0) {
                    if (y - 2 > 0) neighbors.push(this.grid[y - 2][x]);
                    neighbors.push(this.grid[y - 1][x + 1]);
                    neighbors.push(this.grid[y + 1][x + 1]);
                    if (y + 2 < height) neighbors.push(this.grid[y + 2][x]);
                    neighbors.push(this.grid[y + 1][x]);
                    neighbors.push(this.grid[y - 1][x]);
               // Tuile sur une ligne impaire (x,y impair)
                } else {
                    if (y - 2 > 0) neighbors.push(this.grid[y - 2][x]);
                    neighbors.push(this.grid[y - 1][x]);
                    neighbors.push(this.grid[y + 1][x]);
                    if (y + 2 < height) neighbors.push(this.grid[y + 2][x]);
                    neighbors.push(this.grid[y + 1][x - 1]);
                    neighbors.push(this.grid[y - 1][x - 1]);
                }
            }
        }
        tile.set_neighbors(neighbors);
    }

    // Homogénéisation des biomes
    smooth_neighbors(smooth_type) {
        let tabs = [];
        let height = this.get_map_height(),
            width = this.get_map_width();
        for (let y = 0; y < height; y++) {
            tabs[y] = [];
            for (let x = 0; x < width; x++) {
               // Calcul de la moyenne des paramètres des voisins de la tuile courante
                let tile = this.grid[y][x],
                    neighbors = tile.get_neighbors(),
                    e_moy = 0,
                    h_moy = 0,
                    t_moy = 0;
                for (let i = 0; i < neighbors.length; i++) {
                    e_moy += neighbors[i].get_elevation();
                    h_moy += neighbors[i].get_humidity();
                    t_moy += neighbors[i].get_temperature();
                }
                e_moy /= neighbors.length;
                h_moy /= neighbors.length;
                t_moy /= neighbors.length;
                tabs[y][x] = {
                    tile: tile,
                    elev: e_moy,
                    humidity: h_moy,
                    temp: t_moy
                }
            }
        }
        // Application des paramètres moyen des voisins de la tuile courante
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                switch (smooth_type) {
                    case 1:
                        tabs[y][x].tile.set_elevation(tabs[y][x].elev);
                        break;
                    case 2:
                        tabs[y][x].tile.set_humidity(tabs[y][x].humidity);
                        break;
                    default:
                        tabs[y][x].tile.set_temperature(tabs[y][x].temp);
                        break;
                }
            }
        }
    }

    // Ajout du littoral
    littoral = (x, y) => {
        this.grid[y][x].littoral();
    }

    // Ajout des fleurs
    add_asset = (x, y, height, width, frequency, id_asset, id_tile) => {
        let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
            tile = this.grid[y][x];
        if (frequency > Math.random() && tile.get_image_id() === id_tile && this.river_path.indexOf(tile) === -1 && this.town_path.indexOf(tile) === -1) {
            this.draw_tile(deplacement, y, this.get_hextiles_images(), this.get_img_x(id_asset), this.get_img_y(id_asset));
        }
    }

    // Ajout des villes
    add_towns = (x, y, height, width, frequency) => {
        let tile = this.grid[y][x];
        if (this.river_path.indexOf(tile) !== -1) return; // si on est sur une tuile de river
        if (0.05 > Math.random() && tile.get_image_id() === 6) { // Fréquence d'ajout d'une ville portuaire
            tile.set_image_id(38);
        }
        let neighbors = tile.get_neighbors();
        // Vérification qu'il n'y a aucune ville en voisin
        for (let i = 0; i < neighbors.length; i++) {
            if (this.town.indexOf(neighbors[i]) !== -1) return;
        }
        if (frequency > Math.random() && tile.get_image_id() !== 7 && tile.get_neighbors().length === 6) {
            if (tile.get_image_id() === 6) {// ville cotière : LITORAL
                let neighbors = tile.get_neighbors();
                if (neighbors[4].isNotSeaOrLittoral() || neighbors[5].isNotSeaOrLittoral()) { // Ville cotière placée sur le côté gauche
                    tile.set_image_id(36);
                    this.town.push(tile);
                } else if (neighbors[2].isNotSeaOrLittoral() || neighbors[1].isNotSeaOrLittoral()) { // Ville cotière placée sur le côté droit
                    tile.set_image_id(37);
                    this.town.push(tile);
                }
            } else if (tile.get_elevation() < 0.68) {// ville du continent hors NEIGE
                if (tile.get_temperature() < 0.44) {// ville du biome DESERT
                    let town = parseInt(Math.random() * 2) + 30;
                    tile.set_image_id(town);
                    this.town.push(tile);
                } else {// ville du biome PLAINE ou SAVANE
                    let town = parseInt(Math.random() * 3) + 8;
                    tile.set_image_id(town);
                    this.town.push(tile);
                }
            } else {// ville du biome NEIGE
                let town = parseInt(Math.random() * 2) + 22;
                tile.set_image_id(town);
                this.town.push(tile);
            }

        }
    }

    // Ajout des rivières
    add_rivers = (x, y, height, width, frequency) => {
        let tile = this.grid[y][x];
        if (frequency > Math.random() && tile.get_elevation() > 0.7 && tile.get_elevation() < 0.805) {
            this.river_pathfinding([tile]);
        }
    }

    // Recher du chemin de la rivière
    river_pathfinding(river_tiles) {
        let current = river_tiles[river_tiles.length - 1],
            elevation = current.get_elevation(),
            temperature = current.get_temperature();

        // Arrivée à la mer
        if (elevation < 0.24) {
        }
        // Continent hors montagne
        else if (elevation < 0.68) {
            if (temperature < 0.44) { // biome DESERT
                current.set_image_id(24);
            } else if (temperature < 0.49) { // biome SAVANE
                current.set_image_id(14);
            } else if (temperature < 0.7) { // biome PLAINE
                current.set_image_id(0);
            }
        }
        else if (elevation < 0.805) current.set_image_id(16); // biome NEIGE
        else current.set_image_id(5); // montagne enneigée

        current.humidity = 200; // Pour éviter qu'une route suive le cours d'une rivière
        this.river_path.push(current);// Ajout de la tuile à la liste de rivières
        if (!current.isNotSeaOrLittoral()) {
            return; // break condition
        }
        let neighbors = current.get_neighbors(),
            min = 1,
            lower = current;
        // Recherche du voisin avec la plus faible élévation
        for (let i = 0; i < neighbors.length; i++) {
            let elev = neighbors[i].get_elevation();
            if (river_tiles.indexOf(neighbors[i]) === -1 && elev <= min) {
                min = elev;
                lower = neighbors[i];
            }
        }
        river_tiles.push(lower)
        return this.river_pathfinding(river_tiles);
    }

    // Dessin d'une rivière
    draw_river() {
        for (let i = 0; i < this.river_path.length; i++) {
            let current = this.river_path[i],
                index_of_previous_neighbors = i !== 0 ? current.get_neighbors().indexOf(this.river_path[i - 1]) : false;
            if (i === 0 || index_of_previous_neighbors === -1) { // Pas de précédent
                this.draw_river_or_town_path(-1, current, current.get_neighbors().indexOf(this.river_path[i + 1]));
            } else if (i === this.river_path.length || current.get_neighbors().indexOf(this.river_path[i + 1]) === -1) { // Pas de suivant
                let previous = current.get_neighbors().indexOf(this.river_path[i - 1]);
                this.draw_river_or_town_path(previous, current, -1);
            } else { // Cas global
                let previous = current.get_neighbors().indexOf(this.river_path[i - 1]),
                    next = current.get_neighbors().indexOf(this.river_path[i + 1]);
                this.draw_river_or_town_path(previous, current, next);
            }
        }
    }

    draw_river_or_town_path(previous, current, next, is_road) {
        let deplacement = current.get_y() % 2 === 0 ? current.get_x() * 48 + 24 : current.get_x() * 48,
            id, angle = 0;
        if (next === -1) return; // Fin du dessin de la rivière
        if (previous === -1) { // Début du dessin de la rivière
            id = 17; // avec un prochain étant un voisin in [0, 1, 3, 4]
            if(next === 0 || next === 3) angle = 300;
            else if(next === 2 || next === 5) id = 18;
        }
        else if (previous === 0) {
            id = 19; // avec un prochain étant un voisin in [1, 5]
            if (next === 1) {
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
                angle = 60;
            }
        } else if (previous === 1) {
            id = 19; // avec un prochain étant un voisin in [0, 2]
            if (next === 0) {
                angle = 120;
            } else if (next === 2) {
                angle = 180;
            } else if (next === 3) {
                id = 21;
                angle = 300;
            } else if (next === 4) {
                id = 17;
            } else{
                id = 22;
            }
        } else if (previous === 2) {
            id = 21; // avec un prochain étant un voisin in [0, 4]
            if (next === 0) {
                angle = 240;
            } else if (next === 1) {
                id = 20;
            } else if (next === 3) {
                id = 19;
                angle = 240;
            } else if (next === 5) {
                id = 18;
            }
        } else if (previous === 3) {
            id = 19; // avec un prochain étant un voisin in [2, 4]
            if (next === 0) {
                id = 17;
                angle = 300;
            } else if (next === 1) {
                id = 21;
                angle = 300;
            } else if (next === 2) {
                angle = 240;
            } else if (next === 4) {
                angle = 300;
            } else {
                id = 21;
                angle = 60;
            }
        } else if (previous === 4) {
            id = 19; // avec un prochain étant un voisin in [3, 5]
            if (next === 0) {
                id = 22;
                angle = -60;
            } else if (next === 1) {
                id = 17;
            } else if (next === 2) {
                id = 21;
            } else if (next === 3) {
                angle = 300;
            }
        } else {
            id = 19; // avec un prochain étant un voisin in [1, 5]
            if (next === 0) {
                angle = 60;
            } else if (next === 1) {
                id = 22;
            } else if (next === 2) {
                id = 18;
            } else if (next === 3) {
                id = 21;
                angle = 60;
            }
        }
        if (is_road) id -= 16;
        this.draw_path(deplacement, current.get_y(), this.HEXTILES_PATH, this.get_img_x(id), this.get_img_y(id), angle);
    }

    // Ecriture du nom de ville
    draw_town_name() {
        for (let i = 0; i < this.town.length; i++) {
            let deplacement = this.town[i].get_y() % 2 === 0 ? this.town[i].get_x() * 48 + 24 : this.town[i].get_x() * 48,
                tile = this.town[i];
            let random_int = Math.floor(Math.random() * (this.town_names.length));
            this.draw_text(deplacement, tile.get_y(), this.town_names[random_int]);
            this.town_names.splice(random_int, 1);
        }
    }

    // Set des routes entre les villes
    set_town_path() {
        for (let i = 0; i < this.town.length; i++) {
            let start = this.town[i], end = this.town[i + 1];
            if (!end) { // fin de boucle end n'existe pas, on relie la derniere ville et la premiere
                start = this.town[this.town.length - 1];
                end = this.town[0];
                this.town_pathfinding(start, end);
                this.town_path.push(start);
                return;
            } else {
                this.town_pathfinding(start, end);
                this.town_path.push(start);
            }
        }
    }

    // Recherche du chemin le moins coûteux
    town_pathfinding(start, end) {
        let queue = new PriorityQueue(),
            came_from = {},
            cost_so_far = {};
        queue.enqueue(start, 0);
        came_from[start.to_string()] = null;
        cost_so_far[start.to_string()] = 0;

        while (!queue.isEmpty()) {
            let current = queue.dequeue().element;
            if (current.to_string() === end.to_string()) {
                while (current !== start) {
                    this.town_path.push(current);
                    current = came_from[current.to_string()];
                }
                return;
            }
            let neighbors = current.get_neighbors();
            for (let i = 0; i < neighbors.length; i++) {
                let next = neighbors[i],
                    new_cost = cost_so_far[current.to_string()] + this.get_cost(next);
                if ((cost_so_far[next.to_string()] === undefined || new_cost < cost_so_far[next.to_string()]) &&
                    next.isNotSeaOrLittoral()) {
                    cost_so_far[next.to_string()] = new_cost;
                    let priority = new_cost + this.heuristic(end, next);
                    queue.enqueue(next, priority);
                    came_from[next.to_string()] = current;
                }
            }
        }
    }

    heuristic(a, b) {
        // Manhattan distance sur un grille carré
        return Math.abs(a.get_x() - b.get_x()) + Math.abs(a.get_y() - b.get_y());
    }

    // Calcul du coût
    get_cost(tile) {
        let id = tile.get_image_id(),
            h = tile.get_humidity();
        if (id === 0 || id === 16 || id === 24 || id === 14) {
            if (h === 200) return 5; // Cas où on est sur une rivière
            return 1;
        }
        else if (id === 1 || id === 13 || id === 26 || id === 17) return 2;
        else if (id === 2 || id === 12 || id === 18) return 3;
        else if (id === 3 || id === 4 || id === 19 || id === 20 || id === 25) return 4;
        else return 100;
    }

    // Dessin des routes
    draw_town_path() {
        for (let i = 0; i < this.town_path.length; i++) {
            let current = this.town_path[i];
            if (this.town.indexOf(current) !== -1) {
                continue;
            } else if (i === this.town_path.length || current.get_neighbors().indexOf(this.town_path[i + 1]) === -1) { // Pas de suivant
                let previous = current.get_neighbors().indexOf(this.town_path[i - 1]);
                this.draw_river_or_town_path(previous, current, -1, true);
            } else {// Cas global
                let previous = current.get_neighbors().indexOf(this.town_path[i - 1]),
                    next = current.get_neighbors().indexOf(this.town_path[i + 1]);
                this.draw_river_or_town_path(previous, current, next, true);
            }
        }
    }


    draw_grid = (x, y) => {
        let deplacement = y % 2 === 0 ? x * 48 + 24 : x * 48,
            tile = this.grid[y][x];
        this.draw_tile(deplacement, y, this.get_hextiles_images(), this.get_img_x(tile.get_image_id()), this.get_img_y(tile.get_image_id()));
    }
}
