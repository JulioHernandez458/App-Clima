const fs = require('fs');

const color = require('colors');
const axios = require('axios');

class Busqueda {

    historial = [];

    dbPath = './db/data.json';

    constructor() {

    }

    // Se devuelven los parametros para enviarlo a mapbox
    get paramsMapbox() {

        return {
            //types: ['country', 'region'],
            language: 'es',
            limit: 5,
            access_token: process.env.MAPBOX_KEY
        }

    }

    // Se devuelven los parametros para enviarlos a openweather
    get paramsOpenWeather() {

        return {
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric',
        }

    }


    // Se devuelve el historial de los lugares buscados capitalizados
    get historialCapitalizado() {

        return this.historial.map(lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');

        })

    }

    // Metodo que vuelve la información del lugar ingresado
    async encontrarLugar(info = '') {

        try {

            //const lugar = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ info }.json?types=country%2Cregion&language=es&access_token=${process.env.MAPBOX_KEY}`);


            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${info}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();

            return resp.data.features.map(lugar => ({

                id: lugar.id,
                nombre: lugar.place_name,
                lon: lugar.center[0],
                lat: lugar.center[1]

            }));

        } catch (e) {
            console.log(e);
        }
    }


    // Metodo que devuelve la informacion del clima del lugar enviado
    async climaLugar(lat, lon) {

        try {

            const instancia = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const resp = await instancia.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max
            }

        } catch (error) {
            console.log(error);
        }

    }


    // Agrega un lugar buscado al arreglo de hostorial
    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarData();



    }



    // Crea y Guarda la informacion recibida en un archivo JSON
    guardarData() {

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    // Funcion que lee el archivo JSON que contiene los datos
    leerData() {

        // Si no existe el archivo devuelve null
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }

        // Se leen los datos deñ archivo JSON y se devuelven los datos
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;
    }


}

module.exports = Busqueda;