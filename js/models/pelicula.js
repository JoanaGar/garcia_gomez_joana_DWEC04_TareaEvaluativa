class Pelicula {
    constructor(titulo, id, imagen, rating, resumen, generos=[]) {
        this.titulo = titulo;
        this.id = id;
        this.imagen = imagen;
        this.rating = rating;
        this.resumen = resumen;
        this.generos = generos;
    }
}