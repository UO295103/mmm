class Agenda {
    constructor() {
        // Modificamos la URL para incluir el parámetro 'language=es' para obtener los datos en español
        this.url = "https://ergast.com/api/f1/current/races.json?language=es";
        this.first=true;
    }

    obtenerCarreras() {
        $.getJSON(this.url, (data) => {
             this.races = data.MRData.RaceTable.Races;
             this.mostrarCarreras();
        })
        .fail(function() {
            console.log("Error al obtener los datos de las carreras.");
        });
    }

    mostrarCarreras() {

        const racesSection = $(`<section></section>`);
        var title = document.createElement('h2');
        title.textContent = 'Carreras de la temporada actual:';
        racesSection.append(title);
        this.races.forEach(race => {

            const nombreCarrera = race.raceName; //nombre de la carrera
            const circuito = race.Circuit.circuitName; //Nombre del circuito
            const coordenadas = race.Circuit.Location.lat + ", " + race.Circuit.Location.long; //Combinamos las coordenadas en una
            const pais = race.Circuit.Location.country; //PAis

            // Obtenemos la fecha y hora
            const fecha = new Date(race.date + "T" + race.time); //Creamos la fecha completa de la que sacaremos valores
            const dia = fecha.getDate(); // Día
            const mes = fecha.getMonth() + 1; // Mes 
            const año = fecha.getFullYear(); // Año
            const horas = fecha.getHours(); // Horas
            const minutos = fecha.getMinutes(); // Minutos

            //Separamos la fecha en dos para mostar mas claramete al usuario
            const fechaFormateada = `${dia} / ${mes} / ${año}`; // Fecha 
            const horaFormateada = `${horas}:${minutos < 10 ? '0' + minutos : minutos}`; // Hora con comprobacion para mostrar dos digitos

            //Creamos un article con la informacion de cada carrera
            const carreraHTML = `
                <article >
                    <h4>${nombreCarrera}</h4>
                    <p><strong>País:</strong> ${pais}</p>
                    <p><strong>Circuito:</strong> ${circuito}</p>
                    <p><strong>Coordenadas:</strong> ${coordenadas}</p>
                    <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                    <p><strong>Hora:</strong> ${horaFormateada}</p>
                </article>
            `;

            
            // Añadimos la carrera al section
            racesSection.append(carreraHTML);
        });
        //Añadimos todas las carreras al body
        $("body").append(racesSection);
    }
}

var agenda = new Agenda();

function imprimirCarreras(){    
    if (agenda.first) {
        agenda.obtenerCarreras();
        agenda.first = false;
    }
}