class Controller {
    constructor(grid, view) {
        this.grid = grid;
        this.view = view;
    }

    init() {
        var view = this.view,
            grid = this.grid,
            ctrl = this;
        this.view.get_map_L().addEventListener('change', function () {
            var h = parseInt(view.get_map_H().value),
                l = parseInt(view.get_map_L().value);
            grid.set_map_H(h);
            grid.set_map_L(l);
            grid.generate();
        });

        this.view.get_map_H().addEventListener('change', function () {
            var h = parseInt(view.get_map_H().value),
                l = parseInt(view.get_map_L().value);
            grid.set_map_H(h);
            grid.set_map_L(l);
            grid.generate();
        });

        this.view.set_map_H(this.grid.get_map_H());
        this.view.set_map_L(this.grid.get_map_L());
        this.grid.bind_draw(this.draw_tuile);
        this.grid.bind_refresh(this.refresh_canvas);
        this.grid.bind_draw_text(this.draw_text);

        //noise.seed(Math.random());
        //noise2.seed(Math.random());


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
    draw_text = (x,y,text) => {
        this.view.draw_text(x,y,text);
    }
}


$(document).ready(function () {
    const app = new Controller(new Grid(), new View());
    app.init();
});
