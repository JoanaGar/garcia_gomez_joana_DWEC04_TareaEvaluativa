$(document).ready(function () {

    const API_KEY = "fcca5ebfe3df19ebd0ad5b34dcac9442";
    const URL_MOVIE = `https://api.themoviedb.org/3/movie/`;
    const URL_GENEROS = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    let generosMapa = {};

    // Primero cargar géneros
    $.get(URL_GENEROS, function(data) {
        data.genres.forEach(g => generosMapa[g.id] = g.name);

        // Luego cargar los datos de la película
        $.get(`${URL_MOVIE}${id}?api_key=${API_KEY}&language=es-ES`, function(p) {

            const pelicula = new Pelicula(
                p.title,
                p.id,
                `https://image.tmdb.org/t/p/w300${p.poster_path}`,
                p.vote_average,
                p.overview,
                p.genres.map(g => g.id)
            );

            // Mostrar detalle
            $("#detalle").html(Templates.detalle(pelicula));

            // Botones de géneros
            $("#generos-pelicula").empty();
            pelicula.generos.forEach(idGenero => {
                const nombre = generosMapa[idGenero] || "Desconocido";
                const boton = $(`<button class="btn-genero">${nombre}</button>`);
                boton.click(() => window.location.href = `index.html?genero=${idGenero}`);
                $("#generos-pelicula").append(boton);
            });

            // Gráfico
            const ctx = document.getElementById("grafico").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["⭐ Puntuación"],
                    datasets: [{ label: "Puntuación", data: [pelicula.rating], backgroundColor: "#6c5ce7" }]
                },
                options: {
                    responsive: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: { y: { min: 0, max: 10 } }
                }
            });

            $("#grafico").attr({ width: 300, height: 150 });
        });

    });

});