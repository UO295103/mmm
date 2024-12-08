
class viajes{

    constructor (){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;       
        this.mostrarMapaEstatico();
        this.mostrarMapaDinamico();
    }

    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    mostrarMapaEstatico() {
        const apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        const url = "https://maps.googleapis.com/maps/api/staticmap?";
        const centro = `center=${this.latitud},${this.longitud}`;
        const zoom = "&zoom=15";
        const tamaño = "&size=800x600";
        const marcador = `&markers=color:red%7Clabel:S%7C${this.latitud},${this.longitud}`;
        const sensor = "&sensor=false";

        this.imagenMapa = `${url}${centro}${zoom}${tamaño}${marcador}${sensor}${apiKey}`;
        const mapa = `<img src='${this.imagenMapa}' alt='Mapa con la ubicacion del usuario' />`;
        
        const section = document.createElement("section");
        
        const titulo = document.createElement("h2");
        titulo.textContent = "Mapa estático:";

        section.appendChild(titulo);
        section.innerHTML += mapa;
         $("main").append(section);
    }

    mostrarMapaDinamico() {
        // Verifica si Google Maps ya está cargado
        if (typeof google === 'undefined') {
            // Si no está cargado, crea un script para cargar la API
            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&callback=initMap";
            script.async = true;
            script.defer = true;
    
            // Define la función callback para inicializar el mapa
            window.initMap = () => {
                this.initGoogleMap();
            };
    
            // Agrega el script al documento
            document.head.appendChild(script);
        } else {
            // Si Google Maps ya está cargado, inicializa el mapa directamente
            this.initGoogleMap();
        }
    }
    
    // Método separado para inicializar el mapa una vez cargada la API
    initGoogleMap() {
        const centro = { lat: this.latitud, lng: this.longitud };
    
        // Crear la sección para el mapa
        const section = document.createElement("section");
        const titulo = document.createElement("h2");
        titulo.textContent = "Mapa dinámico:";
        section.appendChild(titulo);
    
        // Crear el contenedor para el mapa
        const mapa = document.createElement("div");
        section.appendChild(mapa);
        document.querySelector("main").appendChild(section);
    
        // Inicializar el mapa
        const mapaGeoposicionado = new google.maps.Map(mapa, {
            zoom: 8,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });
    
        // Agregar geolocalización
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
    
                    const infoWindow = new google.maps.InfoWindow({
                        position: pos,
                        content: "Localización encontrada",
                    });
    
                    infoWindow.open(mapaGeoposicionado);
                    mapaGeoposicionado.setCenter(pos);
                },
                () => {
                    this.handleLocationError(true, mapaGeoposicionado.getCenter());
                }
            );
        } else {
            console.error("Geolocalización no soportada por el navegador.");
        }
    }
    
    handleLocationError(browserHasGeolocation, pos) {
        const errorMessage = browserHasGeolocation
            ? "Error: Ha fallado la geolocalización."
            : "Error: Su navegador no soporta geolocalización.";
        console.error(errorMessage);
    
        const infoWindow = new google.maps.InfoWindow({
            position: pos,
            content: errorMessage,
        });
        infoWindow.open();
    }
    
  }

  class Carousel {
    constructor() {

        this.slides = document.querySelectorAll('article img');

        this.curSlide = 0;

        this.maxSlide = this.slides.length - 1;

        this.assignEvents();
        this.updateImagen();
    }

    assignEvents() {
        
        const nextButton = document.querySelector("button:nth-of-type(1)");
        nextButton.addEventListener('click', () => {
            this.nextSlide();
        });

        
        const prevButton = document.querySelector("button:nth-of-type(2)");
        prevButton.addEventListener('click', () => {
            this.prevSlide();
        });
    }

    nextSlide() {
        this.curSlide = (this.curSlide === this.maxSlide) ? 0 : this.curSlide + 1;
        this.updateImagen();
    }

    prevSlide() {
        this.curSlide = (this.curSlide === 0) ? this.maxSlide : this.curSlide - 1;
        this.updateImagen();
    }

    updateImagen() {
        this.slides.forEach((slide, indx) => {
            const transformValue = 100 * (indx - this.curSlide);
            slide.style.transform = `translateX(${transformValue}%)`;
        });
    }
}


