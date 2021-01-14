class Tuile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.voisin = [];
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

    getZ() {
        return this.z;
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
    }

    setElevation(e) {
        this.elevation = e;
    }

    setImageId(id) {
        this.imageId = id;
    }

    setVoisin(v) {
        this.voisin = v;
    }

    getVoisin() {
        return this.voisin;
    }

    //TODO
    isVoisinDe(id) {
        forEach((Tuile, t,
        this.voisin
    ) =>
        {
            if (t.getImageId == id) {
                return true
            }
        }
    )
        ;
        return false;

    }

    generateImageId() {
        //OCEAN
        if (this.elevation < 1) {
            this.imageId = 7;
        }
        //PLAINE
        else if (this.elevation > 1 && this.elevation < 1, 5) {
            //SANS VEGETATION
            if (this.humidity < 1) {
                this.imageId = 0;
            }
            //VEGETATION +
            else if (this.humidity > 1 && this.humidity < 2) {
                this.imageId = 1;
            }
            //VEGETATION ++
            else if (this.humidity > 2 && this.humidity < 3) {
                this.imageId = 2;
            }
            //LAC
            else if (this.humidity > 3 && this.humidity < 4) {
                this.imageId = 6;
            }
        }
        //PLAINE ALTITUDE (proche de la neige)
        else if (this.elevation > 1, 5 && this.elevation < 2) {
            //CAILLOUX
            if (this.humidity < 1) {
                this.imageId = 3;
            }
            //CAILLOUX + VEGETATION
            else if (this.humidity > 1 && this.humidity < 2) {
                this.imageId = 4;
            }
            //CAILLOUX NEIGE
            else if (this.humidity > 2 && this.humidity < 3) {
                this.imageId = 19;
            }
            //CAILLOUX NEIGE + VEGETATION
            else if (this.humidity > 3 && this.humidity < 4) {
                this.imageId = 20;
            }
        }
        //NEIGE
        else if (this.elevation > 2 && this.elevation < 3) {
            //SANS VEGETATION
            if (this.humidity < 1) {
                this.imageId = 16;
            }
            //VEGETATION +
            else if (this.humidity > 1 && this.humidity < 2) {
                this.imageId = 17;
            }
            //VEGETATION ++
            else if (this.humidity > 2 && this.humidity < 3) {
                this.imageId = 18;
            }
            //LAC GELE
            else if (this.humidity > 3 && this.humidity < 4) {
                this.imageId = 21;
            }
        }
        //MONTAGNE
        else if (this.elevation > 1 && this.elevation < 2) {
            //SANS VEGETATION
            if (this.humidity < 1) {
                this.imageId =;
            }
            //VEGETATION +
            else if (this.humidity > 1 && this.humidity < 2) {
                this.imageId = 17;
            }
            //VEGETATION ++
            else if (this.humidity > 2 && this.humidity < 3) {
                this.imageId = 18;
            }
            //LAC
            else if (this.humidity > 3 && this.humidity < 4) {
                this.imageId = 21;
            }
        }

    }


}