class Controller {
    constructor(grid, view) {
        this.grid = grid;
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

        this.view.set_map_H(this.grid.get_map_H());
        this.view.set_map_L(this.grid.get_map_L());
        this.grid.bind_draw(this.draw_tuile);
        this.grid.bind_refresh(this.refresh_canvas);

        noise.seed(Math.random());

        Promise.all([
            new Promise((resolve) => {
                this.grid.get_hextiles_images().addEventListener('load', () => {
                    resolve();
                });
            })
        ])
        .then(() => {
            this.grid.generate();
        });
    }

    draw_tuile = (deplacement, y, hextiles, id_x, id_y) => {
        this.view.draw_tuile(deplacement, y, hextiles, id_x, id_y);
    }

    refresh_canvas = () => {
        this.view.refresh();
    }
}


$(document).ready(function () {
    const app = new Controller(new Grid(), new View());
    app.init();
});
