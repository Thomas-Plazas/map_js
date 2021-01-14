class Tuile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.voisins = [];
        this.humidity = 0;
        this.elevation = 0;
        this.imageId = 0;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getHumidity() {
        return this.humidity;
    }

    getElevation() {
        return this.elevation;
    }

    getImageId() {
        return this.imageId;
    }

    setHumidity(h) {
        this.humidity = h;
        this.generateImageId();
    }

    setElevation(e) {
        this.elevation = e;
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

    //TODO
    isVoisinDe(id) {
        this.getVoisins().forEach(element =>
            console.log(element)
        );
    }

    fill_holes(){
        let terre = 0, eau = 0,
            voisins = this.getVoisins(),
            tot_elev = 0,
            tot_hum = 0;

        for(let i=0; i < voisins.length; i++){
            if(voisins[i].getImageId() === 7){
                eau++;
            }
            else{
                terre++;
            }
            tot_elev += voisins[i].getElevation();
            tot_hum += voisins[i].getHumidity();
            /*test
            if(voisins[i] !== undefined){
                voisins[i].setImageId(24);
            }*/
        }
        if(this.getImageId() === 7) {
            if(terre > eau && voisins.length === 6){
                this.setElevation(tot_elev/voisins.length);
                this.setHumidity(tot_hum/voisins.length);
            }
        }
        else{
            if(terre === 0){
                this.setImageId(7);
            }
        }
        this.littoral();
    }

    littoral(){
        let terre = 0,
            voisins = this.getVoisins();
        for(var i=0; i < voisins.length; i++){
            if(voisins[i].getImageId() !== 7 && voisins[i].getImageId() !== 6){
                terre++;
            }
        }
        if(this.getImageId() === 7) {
            if(terre > 0){
                this.setImageId(6);
            }
        }
    }

    generateImageId() {
        var e = this.elevation,
            m = this.humidity;

        if (e < 0.3){
            this.setImageId(7); // MER
        }
        else if (e > 0.8){
            this.setImageId(5); // HAUTE MONTAGNE
        }
        else if (e > 0.6){ // MOYENNE MONTAGNE
            if (m < 0.33){
                this.setImageId(4); // VERDURE
            }
            else if (m < 0.66){
                this.setImageId(19); // NEIGE
            }
        }
        else if (e > 0.3){ // PLAINE / FORÊTS
            if (m < 0.16){
                this.setImageId(0);
            }
            else if (m < 0.50){
                this.setImageId(0);
            }
            else if (m < 0.83){
                this.setImageId(2);
            }
            else{
                this.setImageId(18);
            }
        }

        else if (e < 0.3){  // PLAINE / FORÊTS
            if (m < 0.16){
                this.setImageId(0);
            }
            if (m < 0.33){
                this.setImageId(1);
            }
            if (m < 0.66){
                this.setImageId(2);
            }
        }
    }
}
