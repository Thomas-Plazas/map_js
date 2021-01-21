class Controller {
    constructor(grid, view) {
        this.grid = grid;
        this.view = view;
    }

    init() {
        var view = this.view,
            grid = this.grid,
            ctrl = this;

        this.grid.bind_draw(this.draw_tuile);
        this.grid.bind_refresh(this.refresh_canvas);
        this.grid.bind_draw_text(this.draw_text);
        this.grid.bind_draw_river(this.draw_river);
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
    draw_river = (x, y, hextiles, img_x, img_y, angle) => {
        this.view.draw_river(x, y, hextiles, img_x, img_y, angle);
    }
}


$(document).ready(function () {
    const app = new Controller(new Grid(), new View());
    app.init();
});
