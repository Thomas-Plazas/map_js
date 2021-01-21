class Tuile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.voisins = [];
        this.humidity = 0;
        this.elevation = 0;
        this.temperature = 0;
        this.imageId = 0;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    to_string(){
        return "x" + this.getX() + "y" + this.getY();
    }
    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getHumidity() {
        return this.humidity;
    }

    getElevation() {
        return this.elevation;
    }

    getTemperature() {
        return this.temperature;
    }

    getImageId() {
        return this.imageId;
    }

    setHumidity(h) {
        this.humidity = h;
        this.generateImageId();
    }

    setElevation(e, dont_generate) {
        this.elevation = e;
        if (!dont_generate) this.generateImageId();
    }

    setTemperature(t, dont_generate) {
        this.temperature = t;
        if (!dont_generate) this.generateImageId();
    }

    setImageId(id) {
        this.imageId = id;
    }

    setVoisins(v) {
        this.voisins = v;
    }

    getVoisins() {
        return this.voisins;
    }

    isNotSeaOrLittoral() {
        return this.getImageId() !== 6 && this.getImageId() !== 7;
    }

    //TODO
    isVoisinDe(id) {
        this.getVoisins().forEach(element =>
            console.log(element)
        );
    }

    fill_holes() {
        let terre = 0, eau = 0,
            voisins = this.getVoisins(),
            tot_elev = 0,
            tot_hum = 0;

        for (let i = 0; i < voisins.length; i++) {
            if (voisins[i].getImageId() === 7) {
                eau++;
            } else {
                terre++;
            }
            tot_elev += voisins[i].getElevation();
            tot_hum += voisins[i].getHumidity();
            /*test
            if(voisins[i] !== undefined){
                voisins[i].setImageId(24);
            }*/
        }
        if (this.getImageId() === 7) {
            if (terre > eau && voisins.length === 6) {
                this.setElevation(tot_elev / voisins.length);
                this.setHumidity(tot_hum / voisins.length);
            }
        } else {
            if (terre === 0) {
                this.setImageId(7);
            }
        }
        this.littoral();
    }

    littoral() {
        let terre = 0,
            voisins = this.getVoisins();
        for (var i = 0; i < voisins.length; i++) {
            if (voisins[i].isNotSeaOrLittoral()) {
                terre++;
            }
        }
        if (this.getImageId() === 7) {
            if (terre > 0) {
                this.setImageId(6);
            }
        }
    }

    generateImageId() {

        var e = this.getElevation(),
            m = this.getHumidity(),
            t = this.getTemperature();

        // MER
        if (e < 0.24) {
            this.setImageId(7);
        }
        // Plaine
        else if (e < 0.68) {
            if (t < 0.44) {//DESERT
               if(m < 0.44){
                  this.setImageId(24);
               }
               else if (m < 0.53) {
                  this.setImageId(26);
               }
               else if (m < 0.62) {
                  this.setImageId(25);
               }
               else if (m < 0.695) {
                  this.setImageId(27);
               }
               else{
                  this.setImageId(28);
               }
            } else if (t < 0.49) {//SAVANE

                if(m < 0.45){
                  this.setImageId(14);
               }
               else if (m < 0.53) {
                  this.setImageId(13);
               }
               else {
                  this.setImageId(12);
               }
            } else if (t < 0.7) {//NORMALE
               if(m < 0.44){
                  this.setImageId(0);
               }
               else if (m < 0.53) {
                  this.setImageId(1);
               }
               else if (m < 0.62) {
                  this.setImageId(2);
               }
               else if (m < 0.695) {
                  this.setImageId(4);
               }
               else{
                  this.setImageId(32);
               }
            }

        }
        // Neige
        else if (e < 0.805) {
            if(m < 0.49){
               this.setImageId(16);
            }
            else if (m < 0.56) {
               this.setImageId(17);
            }
            else if (m < 0.62) {
               this.setImageId(18);
            }
            else if (m < 0.695) {
               this.setImageId(19);
            }
            else{
               this.setImageId(20);
            }
        }
        // Montagne
        else {
            this.setImageId(5);
        }
    }

}
