class Controller {
    // Constructeur
    constructor(grid, view) {
        this.grid = grid;
        this.view = view;
    }

    // Initialisation
    init() {
        // Binding des fonctions de la vue pour les utiliser dans le model
        this.grid.bind_draw_tile(this.draw_tile);
        this.grid.bind_draw_text(this.draw_text);
        this.grid.bind_draw_path(this.draw_path);

        // Affichage de la carte
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

    // Fonctions de dessins de la carte
    draw_tile = (deplacement, y, hextiles, id_x, id_y) => {
        this.view.draw_tile(deplacement, y, hextiles, id_x, id_y);
    }

    draw_text = (x, y, text) => {
        this.view.draw_text(x, y, text);
    }

    draw_path = (x, y, hextiles, img_x, img_y, angle) => {
        this.view.draw_path(x, y, hextiles, img_x, img_y, angle);
    }
}

// Initialisation du controller
$(document).ready(function () {
    const app = new Controller(new Grid(), new View());
    app.init();
});
