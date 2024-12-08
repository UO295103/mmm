class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
    }

    rellenarDatos(circuito, gobierno, latitudMeta, longitudMeta, altitudMeta, religion) {
        this.circuito = circuito;
        this.longitudMeta = longitudMeta;
        this.latitudMeta = latitudMeta;
        this.altitudMeta = altitudMeta;
        this.religion = religion;
        this.gobierno = gobierno;
    }

    writeCoords() {
        document.write("<p>Latitud: " + this.latitudMeta + "</p>");
        document.write("<p>Longitud: " + this.longitudMeta + "</p>");
        document.write("<p>Altitud: " + this.altitudMeta + "</p>");
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getInformacionSecundaria() {
        return `
        <ul>
            <li><strong>Circuito:</strong> ${this.circuito}.</li>
            <li><strong>Población:</strong> ${this.poblacion} habitantes.</li>
            <li><strong>Gobierno:</strong> ${this.gobierno}.</li>
            <li><strong>Religión mayoritaria:</strong> ${this.religion}.</li>
        </ul>`;
    }

    showTitle(){  
        // Titulo
        document.write("<h3> Información acerca de ");
        document.write(this.getNombre());
        document.write("</h3>");
    }

    showIntroduccion(){
        document.write("<p>");
        document.write(this.getNombre()); 
        document.write(" es el país en el que se encuentra " +
        "el circuito principal de esta página web. Este país tiene por capital ");
        document.write(this.getCapital()); 
        document.write("</p>");
    }

    showExtraData(){
        document.write("<h3>Datos extra del país</h3>");
        document.write(this.getInformacionSecundaria()); // Usar this en lugar de pais
    }

    consultarMeteorologia() {
        const apiKey = '7495239d816ae3c751357e8488dd990c';
    
        // Consulta usando las coordenadas de la meta
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitudMeta}&lon=${this.longitudMeta}&appid=${apiKey}&units=metric&lang=es&mode=xml`;
    
        // Llamada AJAX para obtener los datos
        $(document).ready(function () {
            // Creamos un secction donde agrupamos los articulos
            const weatherSection = $(`<section></section>`);
            var title = document.createElement('h2');
            title.textContent = 'Previsión meteorológica:';
            weatherSection.append(title);
    
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml", // Pedimos formato XML
                success: function (data) {
    
                    // Inicializamos una lista de días procesados
                    let processedDates = [];
                    
                    // Procesar los datos del XML
                    $(data).find("time").each(function (index) {
                        // Obtener la fecha y hora del pronóstico
                        const dateStr = $(this).attr("from"); // Fecha con hora
                        const tempMax = $(this).find("temperature").attr("max"); // Temperatura máxima
                        const tempMin = $(this).find("temperature").attr("min"); // Temperatura mínima
                        const humidity = $(this).find("humidity").attr("value"); // Humedad
                        const rain = $(this).find("precipitation").attr("value"); // Cantidad de lluvia
                        const icon = $(this).find("symbol").attr("var"); // Icono 
                        const description = $(this).find("symbol").attr("name"); // Descripción
    
                        // Formatear la fecha
                        const date = new Date(dateStr);
                        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
                        // Filtrar solo las previsiones de las 3 de la tarde (hora 15:00)
                        if (date.getHours() == 3 && !processedDates.includes(formattedDate)) {
                            processedDates.push(formattedDate);
    
                            // Construir la URL del icono
                            const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
    
                            // Crear un artículo para cada día de pronóstico
                            const weatherInfo = `
                                <article>
                                    <img src="${iconUrl}" alt="${description}">
                                    <h4><strong>Fecha:</strong> ${formattedDate}</h4>
                                    <p><strong>Máxima:</strong> ${tempMax}°C</p>
                                    <p><strong>Mínima:</strong> ${tempMin}°C</p>
                                    <p><strong>Humedad:</strong> ${humidity}%</p>
                                    <p><strong>Lluvia:</strong> ${rain ? rain + ' mm' : 'Sin lluvias'}</p>
                                </article>
                            `;
    
                            // Añadimos cada artículo a la sección para agruparlos
                            weatherSection.append(weatherInfo);
                        }
    
                        // Limitar a 5 días diferentes
                        if (processedDates.length >= 5) {
                            return false; // Salir cuando ya se han procesado 5 días
                        }
                    });
    
                    // Añadimos la sección de meteorología al cuerpo
                    $("body").append(weatherSection);
                },
                // Manejo de errores
                error: function (xhr, status, error) {
                    console.error("Error al obtener los datos del tiempo:", status, error);
                    $("body").append("<p>Error al obtener los datos del tiempo.</p>");
                },
            });
        });
    }
}

const pais = new Pais("Emiratos Árabes Unidos", "Abu Dabi", 3789860);
pais.rellenarDatos("Yas Marina", "Monarquía Absoluta", 24.4698875, 54.6052031, 4, "Islam");

