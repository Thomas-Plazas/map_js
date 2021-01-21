class Tile {
   // Constructeur
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbors = [];
        this.humidity = 0;
        this.elevation = 0;
        this.temperature = 0;
        this.image_id = 0;
    }

    // Position de la tuile
    get_x() {
        return this.x;
    }

    get_y() {
        return this.y;
    }

    to_string(){
        return "x" + this.get_x() + "y" + this.get_y();
    }

    // Paramètres de la tuile
    get_humidity() {
        return this.humidity;
    }

    get_elevation() {
        return this.elevation;
    }

    get_temperature() {
        return this.temperature;
    }

    get_image_id() {
        return this.image_id;
    }

    // Modifications des paramètres de la tuile
    set_humidity(h) {
        this.humidity = h;
        this.generate_image_id();
    }

    set_elevation(e, dont_generate) {
        this.elevation = e;
        if (!dont_generate) this.generate_image_id();
    }

    set_temperature(t, dont_generate) {
        this.temperature = t;
        if (!dont_generate) this.generate_image_id();
    }

    set_image_id(id) {
        this.image_id = id;
    }

    // Tuiles voisines à la tuile courante
    set_neighbors(v) {
        this.neighbors = v;
    }

    get_neighbors() {
        return this.neighbors;
    }

    // Vérification qu'une tuile n'est ni de la mer, ni du littoral
    isNotSeaOrLittoral() {
        return this.get_image_id() !== 6 && this.get_image_id() !== 7;
    }

    littoral() {
        let terre = 0,
            neighbors = this.get_neighbors();
         // Parcours des neighbors de la tuile courante
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isNotSeaOrLittoral()) terre++;
        }

        // Tile courante = tuile mer
        if (this.get_image_id() === 7) {
           // Si il existe au moins une tuile voisine terre
            if (terre > 0) this.set_image_id(6);
        }
    }

    // Choix du type de tuile
    generate_image_id() {
        let e = this.get_elevation(),
            m = this.get_humidity(),
            t = this.get_temperature();

        //  biome MER
        if (e < 0.24) this.set_image_id(7);
        // continent non enneigé
        else if (e < 0.68) {
            // biome DESERT
            if (t < 0.44) {
               if(m < 0.44) this.set_image_id(24);
               else if (m < 0.53) this.set_image_id(26);
               else if (m < 0.62) this.set_image_id(25);
               else if (m < 0.695) this.set_image_id(27);
               else this.set_image_id(28);

            }
            // biome SAVANE
            else if (t < 0.49) {
                if(m < 0.45) this.set_image_id(14);
               else if (m < 0.53) this.set_image_id(13);
               else this.set_image_id(12);
            }
            // biome PLAINE
            else if (t < 0.7) {
               if(m < 0.44) this.set_image_id(0);
               else if (m < 0.53) this.set_image_id(1);
               else if (m < 0.62) this.set_image_id(2);
               else if (m < 0.695) this.set_image_id(4);
               else this.set_image_id(32);
            }
        }
        // Continent enneigé = biome NEIGE
        else if (e < 0.805) {
            if(m < 0.49) this.set_image_id(16);
            else if (m < 0.56) this.set_image_id(17);
            else if (m < 0.62) this.set_image_id(18);
            else if (m < 0.695) this.set_image_id(19);
            else this.set_image_id(20);
        }
        // Montagne enneigées
        else this.set_image_id(5);
    }

}
