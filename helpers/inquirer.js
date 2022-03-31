const inquirer = require('inquirer');
const colors = require('colors');

// Lista de las opciones del menu que se podran seleccionar
const preguntas = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Clima`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];


const inquirerMenu = async () => {

    console.clear();

    console.log('==========================='.green);
    console.log('   Seleccione una opción   '.white);
    console.log('=========================== \n'.green);

    const { option } = await inquirer.prompt(preguntas);

    return option;

}


// Se crea un input vacion como pausa en la aplicación
const pausa = async () => {

    const presioneEnter = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar...`
        }
    ]

    console.log('\n');

    await inquirer.prompt(presioneEnter);

}

// Input para ingresar el lugar a buscar
const leerInput = async (mensaje) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor!';
                }
                return true;
            }

        }
    ]

    const { desc } = await inquirer.prompt(question);
    return desc;

}


/*  
    Funcion que lista los lugares encontrados. 
*/
const listadoLugares = async (lugares = []) => {

    const choices = lugares.map((lugar, i) => {

        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }

    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Lugar a Seleccionar',
            choices: choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares
}