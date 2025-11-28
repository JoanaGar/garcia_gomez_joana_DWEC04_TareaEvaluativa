const Templates = {
    card: (p) => `
        <div class="card">
            <img src="${p.imagen}" alt="${p.titulo}" data-id="${p.id}">
            <h3>${p.titulo}</h3>
            <p class="rating">⭐ ${p.rating}</p>
            <div class="card-buttons">
                <a href="detalle.html?id=${p.id}">Ver más</a>
                <button class="fav-btn" data-id="${p.id}">⭐</button>
            </div>
        </div>
    `,

    detalle: (p) => `
        <h1>${p.titulo}</h1>
        <img class="img-detalle" src="${p.imagen}">
        <p>${p.resumen}</p>
        <p class="rating">⭐ ${p.rating}</p>
        <div id="generos-pelicula"></div>
    `
};