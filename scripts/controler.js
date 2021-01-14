class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init() {
        var view = this.view,
            ctrl = this;
        this.view.get_map_L().addEventListener('change', function () {
            var h = parseInt(view.get_map_H().value),
                l = parseInt(view.get_map_L().value);
            ctrl.draw(h, l);
        });

        this.view.get_map_H().addEventListener('change', function () {
            var h = parseInt(view.get_map_H().value),
                l = parseInt(view.get_map_L().value);
            ctrl.draw(h, l);
        });

        this.view.set_map_H(this.model.get_map_H());
        this.view.set_map_L(this.model.get_map_L());

        Promise.all([
            new Promise((resolve) => {
                this.model.get_hextiles_images().addEventListener('load', () => {
                    resolve();
                });
            })
        ])
        .then(() => {
            this.draw(this.view.get_map_L().value, this.view.get_map_L().value);
        });
    }

    draw(hauteur, largeur) {
        this.view.get_ctx().clearRect(0, 0, this.view.get_canvas().width, this.view.get_canvas().height);
        var value = [];
        for (var y = 0; y < hauteur; y++) {
            value[y] = [];
            for (var x = 0; x < largeur; x++) {
                var z = y % 2 === 0 ? x * 48 + 24 : x * 48;
                var nx = x / largeur - 0.5, ny = y / hauteur - 0.5;
                value[y][x] = this.noise(nx, ny);

                // var x=i*48;
                // if(j%2==0){
                //    x=i*48+24;
                // }
                var id = Math.floor(Math.random() * (41 - 0)) + 0;
                this.view.draw_tuile(z, y, this.model.get_hextiles_images(), this.model.get_img_X(id), this.model.get_img_Y(id));
            }
        }
    }

    noise(nx, ny){
        // let gen = new SimplexNoise();
        //return gen.noise2D(nx, ny) / 2 + 0.5;
        return 1;
    }
}


$(document).ready(function () {
    const app = new Controller(new Model(), new View());
    app.init();
});
