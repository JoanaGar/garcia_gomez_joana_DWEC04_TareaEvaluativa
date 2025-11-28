$(document).ready(function () {

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    favoritos.forEach(pelicula => {
        const id = pelicula.id;

        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${id}?api_key=fcca5ebfe3df19ebd0ad5b34dcac9442&language=es-ES`,
            method: "GET",
            success: function(p){
                const pelicula = new Pelicula(
                    p.title,
                    p.id,
                    `https://image.tmdb.org/t/p/w200${p.poster_path}`,
                    p.vote_average,
                    p.overview,
                    p.genres.map(g => g.id)
                );
                $("#contenedor-favoritos").append(Templates.card(pelicula));
            }
        });
    });

});