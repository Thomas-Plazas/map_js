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

    isNotSeaOrLittoral(){
        return this.getImageId() !== 6 && this.getImageId() !== 7;
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

         // MER
        if (e < 0.3){
            this.setImageId(7);
        }
        // Plaine
        else if (e < 0.75){
           if(m < 0.3){
             this.setImageId(0);
           }
           else if (m < 0.5) {
              this.setImageId(1);
           }
           else if (m < 0.7) {
              this.setImageId(2);
           }
           else if (m < 0.94) {
              this.setImageId(32);
           }
           else{
             this.setImageId(6);
          }

        }
        // Neige
        else if (e < 0.84){
           if(m < 0.4){
             this.setImageId(16);
           }
           else if (m < 0.6) {
             this.setImageId(17);
           }
           else if (m < 0.8) {
             this.setImageId(18);
           }
           else if (m < 0.94) {
             this.setImageId(20);
           }
           else{
             this.setImageId(21);
          }
        }
        // Montagne
        else{
            this.setImageId(5);
        }
   }

}
