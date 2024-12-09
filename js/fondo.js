class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
        this.apiKey = "814fc4a294890f684042044489d935fa"; 
    }

    setBackground() {
        const flickrAPI = "https://api.flickr.com/services/rest/";

        // Parámetros de la API
        const params = {
            method: "flickr.photos.search", // Método de búsqueda
            api_key: this.apiKey,          // Tu clave API
            tags: this.circuito,           // Etiquetas de búsqueda (circuito en este caso)
            format: "json",                // Formato de la respuesta
            nojsoncallback: 1,             // Desactiva JSONP
            per_page: 1                    // Limitar resultados a 1 imagen
        };

        // Realizar la solicitud con jQuery
        $.getJSON(flickrAPI, params)
            .done((data) => {
                if (data.stat === "ok" && data.photos.photo.length > 0) {
                    // Obtener la primera imagen
                    const photo = data.photos.photo[0];
                    const highQualityImageURL = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
                    // Establecer la imagen como fondo del <body>
                    $("html").css({
                        "background-image": `url(${highQualityImageURL})`,
                        "background-size": "cover",
                        "background-position": "center",
                        "background-repeat": "no-repeat",
                        "height": "100vh"
                    });
                } else {
                    console.log("No se encontraron imágenes para el circuito especificado.");
                }
            })
            .fail(() => {
                console.log("Error al obtener los datos de Flickr.");
            });
    }
}

// Crear una instancia y establecer el fondo
const fondo = new Fondo("Emiratos Árabes Unidos", "Abu Dabi", "Yas Marina");
fondo.setBackground();
