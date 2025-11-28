$(document).ready(function () {

const API_KEY = "fcca5ebfe3df19ebd0ad5b34dcac9442";
const API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES`;
const URL_GENEROS = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;

let listaPeliculas = [];
let listaGeneros = {};

// Función para actualizar KPIs
function actualizarKPIs() {
    $("#total-peliculas").text(listaPeliculas.length);
    if (listaPeliculas.length > 0) {
        const promedio = (listaPeliculas.reduce((acc, p) => acc + p.rating, 0) / listaPeliculas.length).toFixed(1);
        $("#promedio-rating").text(promedio);
    } else {
        $("#promedio-rating").text(0);
    }
    const favs = JSON.parse(localStorage.getItem("favoritos")) || [];
    $("#total-favoritos").text(favs.length);
}

// Cargar géneros
$.get(URL_GENEROS, function (data) {
    data.genres.forEach(g => {
        listaGeneros[g.id] = g.name;
        $("#filtro-genero").append(`<option value="${g.id}">${g.name}</option>`);
    });
    const params = new URLSearchParams(window.location.search);
    const generoParam = params.get("genero");
    if (generoParam) {
        $("#filtro-genero").val(generoParam);
        filtrarYPintar();
    }
});

// Cargar películas
function cargarPeliculas() {
    $.get(API, function (data) {
        listaPeliculas = data.results.map(p =>
            new Pelicula(
                p.title,
                p.id,
                `https://image.tmdb.org/t/p/w200${p.poster_path}`,
                p.vote_average,
                p.overview,
                p.genre_ids
            )
        );
        filtrarYPintar();
        actualizarKPIs();
    });
}

// Filtrar y pintar películas
function filtrarYPintar() {
    let texto = $("#buscar").val().toLowerCase();
    let genero = $("#filtro-genero").val();

    let filtradas = listaPeliculas.filter(p => {
        let coincideTexto = p.titulo.toLowerCase().includes(texto);
        let coincideGenero = genero ? p.generos.includes(parseInt(genero)) : true;
        return coincideTexto && coincideGenero;
    });

    $("#contenedor-peliculas").empty();
    filtradas.forEach(p => $("#contenedor-peliculas").append(Templates.card(p)));
    activarFavoritos();
    activarTooltipSinopsis();
}

// Activar botones de favoritos
function activarFavoritos() {
    $(".fav-btn").off("click").on("click", function () {
        let id = $(this).data("id");
        let favs = JSON.parse(localStorage.getItem("favoritos")) || [];
        if (!favs.some(f => f.id == id)) {
            let peli = listaPeliculas.find(p => p.id == id);
            favs.push(peli);
            localStorage.setItem("favoritos", JSON.stringify(favs));
            alert("Añadido a favoritos ⭐");
            actualizarKPIs();
        }
    });
}

// Tooltip con sinopsis
function activarTooltipSinopsis() {
    $(".card img").off("mouseenter mouseleave mousemove").hover(function () {
        const id = $(this).data("id");
        const pelicula = listaPeliculas.find(p => p.id === id);
        if (pelicula) {
            const tooltip = $(`<div class="tooltip show">${pelicula.resumen}</div>`);
            $("body").append(tooltip);

            $(this).on("mousemove.tooltip", function (e) {
                tooltip.css({
                    top: e.pageY - tooltip.outerHeight() - 10,
                    left: e.pageX + 10
                });
            });
        }
    }, function () {
        $(".tooltip").remove();
        $(this).off("mousemove.tooltip");
    });
}

// Botón buscar
$("#btn-buscar").click(filtrarYPintar);

// Inicializar
cargarPeliculas();
});
