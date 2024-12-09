
class Circuito{


  constructor(){
    this.firtstXML = true;
    this.firtstKML = true;
    this.firtstSVG = true;
  }

  leerXML(files) {

    if(!this.firtstXML){
      alert("Ya se ha cargado un archivo .xml");
      return;
    }
  
    const archivo = files[0]; // Primer archivo seleccionado
  
    if (!archivo) return; // Si no hay archivo, salir
  
    const lector = new FileReader();
  
    lector.onload = function (evento) {
      const contenidoXML = evento.target.result; // Contenido del archivo
      const parser = new DOMParser();
      const datos = parser.parseFromString(contenidoXML, "application/xml");
  
      // Extraer datos generales
      const nombre = datos.querySelector('name').textContent;
      const longitud = datos.querySelector('long').textContent;
      const longitudMedida = datos.querySelector('long').getAttribute('measurement');
      const ancho = datos.querySelector('width').textContent;
      const anchoMedida = datos.querySelector('width').getAttribute('measurement');
      const fecha = datos.querySelector('date').textContent;
      const hora = datos.querySelector('hour').textContent;
      const vueltas = datos.querySelector('laps').textContent;
      const localidad = datos.querySelector('locality').textContent;
      const pais = datos.querySelector('country').textContent;
  
      // Extraer las referencias
      const referencias = Array.from(datos.querySelectorAll('references reference')).map(ref => ref.textContent);
  
      // Extraer fotos
      const fotos = Array.from(datos.querySelectorAll('photos photo')).map(foto => foto.textContent);
  
      // Extraer videos
      const videos = Array.from(datos.querySelectorAll('videos video')).map(video => video.textContent);
  
      // Obtener las coordenadas de la meta
      const coordenadas = {
        longitud: datos.querySelector('gcoordinates longitude').textContent,
        latitud: datos.querySelector('gcoordinates latitude').textContent,
        altitud: datos.querySelector('gcoordinates altitude').textContent
      };
  
      // Extraer segmentos
      const segmentos = Array.from(datos.querySelectorAll('segments segment')).map(segmento => ({
        distancia: segmento.querySelector('distance').textContent,
        medidaDistancia: segmento.querySelector('distance').getAttribute('measurement'),
        sector: segmento.querySelector('sector').textContent,
        coordenadas: {
          longitud: segmento.querySelector('coordinates longitude').textContent,
          latitud: segmento.querySelector('coordinates latitude').textContent,
          altitud: segmento.querySelector('coordinates altitude').textContent
        }
      }));
  
      // Construir el contenido en listas
      let stringDatos = ` 
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Longitud:</strong> ${longitud} ${longitudMedida}</p>
        <p><strong>Ancho:</strong> ${ancho} ${anchoMedida}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Vueltas:</strong> ${vueltas}</p>
        <p><strong>Localidad:</strong> ${localidad}</p>
        <p><strong>País:</strong> ${pais}</p>
      `;
  
      // Referencias
      stringDatos += "<p><strong>Referencias:</strong></p><ul>";
      referencias.forEach(ref => {
        stringDatos += `<li><a href="${ref}">${ref}</a></li>`;
      });
      stringDatos += "</ul>";
  
      // Fotos
      stringDatos += "<p><strong>Fotos:</strong></p><ul>";
      fotos.forEach(foto => {
        stringDatos += `<li><img src="multimedia/imagenes/${foto}" alt="Foto: ${foto}" style="max-width: 200px; max-height: 150px;"></li>`;
      });
      stringDatos += "</ul>";
  
      // Videos
      stringDatos += "<p><strong>Videos:</strong></p><ul>";
      videos.forEach(video => {
        stringDatos += `
          <li>
            <video width="320" height="240" controls>
              <source src="multimedia/videos/${video}" type="video/mp4">
              Tu navegador no soporta este formato de video.
            </video>
          </li>
        `;
      });
      stringDatos += "</ul>";
  
      // Coordenadas globales (con la etiqueta <gcoordinates>)
      stringDatos += `
        <p><strong>Coordenadas de la meta:</strong></p>
        <ul>
          <li><strong>Longitud:</strong> ${coordenadas.longitud}</li>
          <li><strong>Latitud:</strong> ${coordenadas.latitud}</li>
          <li><strong>Altitud:</strong> ${coordenadas.altitud} m</li>
        </ul>
      `;
  
      // Segmentar cada uno de los segmentos
      stringDatos += "<p><strong>Segmentos:</strong></p><ul>";
      var count = 1;
      segmentos.forEach(segmento => {
        stringDatos += `
          <li>
            <p><strong>Segmento número:</strong> ` + count + `<p/>
            <p><strong>Distancia:</strong> ${segmento.distancia} ${segmento.medidaDistancia}</p>
            <p><strong>Sector:</strong> ${segmento.sector}</p>
            <p><strong>Coordenadas:</strong></p>
            <ul>
              <li><strong>Longitud:</strong> ${segmento.coordenadas.longitud}</li>
              <li><strong>Latitud:</strong> ${segmento.coordenadas.latitud}</li>
              <li><strong>Altitud:</strong> ${segmento.coordenadas.altitud} m</li>
            </ul>
          </li>
        `;
        count += 1;
      });
      stringDatos += "</ul>";
  
      // Insertar el contenido en el HTML
      const container = document.querySelector('body');
      const xmlData = document.createElement('section');
      const header = document.createElement('h3');
      header.textContent = "Datos del XML:";
      xmlData.appendChild(header);
      xmlData.innerHTML += stringDatos;
      container.appendChild(xmlData);
    };
  
    this.firtstXML = false;
    lector.readAsText(archivo);
  }
  

// Esta es la única función que se llama cuando se selecciona el archivo KML
leerKML(files) {
  if (!this.firtstKML) {
      alert("Ya se ha cargado un archivo .kml");
      return;
  }

  if (files && files[0]) {
      const file = files[0];

      // Verificar si el archivo es un KML válido
      if (file.type === "application/vnd.google-earth.kml+xml" || file.name.endsWith(".kml")) {
          const reader = new FileReader();

          reader.onload = function (e) {
              // Obtener el contenido del archivo KML
              const kmlContent = e.target.result;

              // Crear el contenedor para el mapa
              const mapa = document.createElement("div");
              const container = document.querySelector('body'); // Obtener el contenedor donde insertar el mapa
              const kmlData = document.createElement('section');
              const header = document.createElement('h3');
              header.textContent = "Mapa del KML:"; // Agregar encabezado
              kmlData.appendChild(header);
              kmlData.appendChild(mapa); // Añadir el contenedor de datos al body
              container.appendChild(kmlData); // Añadir el contenedor del mapa al body

              // Inicializar el mapa
              const map = new google.maps.Map(mapa, {
                  zoom: 15,
              });

              // Función para extraer coordenadas del KML
              const obtenerCoordenadasKML = function (kmlContent) {
                  const coordenadas = [];
                  const parser = new DOMParser();
                  const xmlDoc = parser.parseFromString(kmlContent, "application/xml");

                  // Buscar todas las etiquetas <coordinates> dentro del archivo KML
                  const coordinatesTags = xmlDoc.querySelectorAll("coordinates");

                  coordinatesTags.forEach(tag => {
                      const coordsText = tag.textContent.trim();

                      // Separar múltiples coordenadas en un bloque
                      const coordsArray = coordsText.split(/\s+/);

                      coordsArray.forEach(coord => {
                          const [lng, lat] = coord.split(",").map(Number);
                          coordenadas.push({ lat, lng });
                      });
                  });

                  return coordenadas;
              };

              // Obtener las coordenadas del archivo KML
              const coordenadas = obtenerCoordenadasKML(kmlContent);

              // Añadir los puntos al mapa
              coordenadas.forEach(coord => {
                  new google.maps.Marker({
                      position: coord,
                      map: map,
                      title: `Lat: ${coord.lat}, Lng: ${coord.lng}`
                  });
              });

              // Dibujar líneas entre los puntos
              if (coordenadas.length > 1) {
                  const flightPath = new google.maps.Polyline({
                      path: coordenadas, // Coordenadas de los puntos
                      geodesic: true,
                      strokeColor: "#FF0000", // Color de la línea
                      strokeOpacity: 1.0,
                      strokeWeight: 2 // Grosor de la línea
                  });

                  // Añadir la línea al mapa
                  flightPath.setMap(map);
              }

              // Centrar el mapa y ajustar el zoom basado en los límites de los puntos
              if (coordenadas.length > 0) {
                  const bounds = new google.maps.LatLngBounds();
                  coordenadas.forEach(coord => bounds.extend(coord));
                  map.fitBounds(bounds); // Ajusta el mapa a los límites de los puntos
              } else {
                  alert("No se encontraron coordenadas en el archivo KML.");
              }
          };

          this.firtstKML = false;
          // Leer el archivo KML como texto
          reader.readAsText(file);
      } else {
          alert("Por favor, selecciona un archivo KML válido.");
      }
  }
}


 leerSVG(files) {

  if(!this.firtstSVG){
    alert("Ya se ha cargado un archivo .svg");
    return;
  }

  // Verificar si hay un archivo y si es un archivo SVG
  if (files && files[0] && files[0].type === 'image/svg+xml') {
      var file = files[0];
      var reader = new FileReader();

      reader.onload = function (event) {
          var svgContent = event.target.result;
          const container = document.querySelector('body'); // Obtener el contenedor donde insertar el mapa
          const svgData = document.createElement('section');
          const header = document.createElement('h3');
          header.textContent = "Mapa del Contenido del SVG:"; // Agregar encabezado
          svgData.appendChild(header);
          svgData.innerHTML += svgContent // Añadir el contenedor de datos al body
          container.appendChild(svgData);    // Añadir el contenedor del mapa al body
      };

      // Leer el archivo como texto
      reader.readAsText(file);
      this.firtstSVG = false;
  } else {
      alert('Por favor, selecciona un archivo SVG.');
  }
}

}

const circuit = new Circuito();
