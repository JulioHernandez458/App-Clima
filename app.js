require('dotenv').config();
require('colors');

const Busquedas = require('./helpers/busqueda');
const { inquirerMenu, leerInput, pausa, listadoLugares } = require('./helpers/inquirer');

const main = async() => {

    console.clear();

    let opt;

    const busquedas = new Busquedas();

    busquedas.leerData();

    do{

        opt = await inquirerMenu(); 

        switch(opt){
            case 1:
                const info = await leerInput('Lugar a buscar: ');
                const lugares = await busquedas.encontrarLugar( info );
                const id = await listadoLugares( lugares );
                if( id === '0' ) continue;

                const lugarSeleccionado = lugares.find( l => l.id === id );
                busquedas.agregarHistorial( lugarSeleccionado.nombre );
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lon );

                console.log('Información del lugar'.green);

                console.log('Ciudad: ' + lugarSeleccionado.nombre.green);
                console.log('Lat: ' + `${ lugarSeleccionado.lat }`.green);
                console.log('Lon: ' + `${ lugarSeleccionado.lon }`.green);
                console.log('Temperatura actual: ' + `${clima.temp }°C `.green);
                console.log('Min: ' + `${ clima.temp_min }°C `.green);
                console.log('Max: ' + `${ clima.temp_max }°C `.green);
                console.log('Clima: ' + `${ clima.desc }`.green);

                
                break;
            case 2:

                busquedas.historialCapitalizado.forEach( ( lugar, i ) => {

                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }` );

                })

                break;
        }

        if ( opt !== 0 ) await pausa();
    }while(opt !== 0);


}

main();