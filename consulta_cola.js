const amqp = require('amqplib');
const fs = require('fs');
const axios = require('axios');

const RABBITMQ_QUEUE = 'Monitor';
const RABBITMQ_URL = 'amqp://michael:michael@192.168.100.134'; // Cambia esto si tu servidor RabbitMQ tiene una URL diferente

// Matriz para almacenar los datos recibidos
const matrizDatos = [];
const matrizDatos1 = [];
const registrosDuplicados = [];

async function recibirDatos() {
    try {
        // Establecer conexión con RabbitMQ
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Declarar la cola
        await channel.assertQueue(RABBITMQ_QUEUE);

        // Consumir los mensajes de la cola
        channel.consume(RABBITMQ_QUEUE, (mensaje) => {
            if (mensaje !== null) {
                const contenido = mensaje.content.toString();

                // Procesar el contenido JSON y guardarlo en la matriz
                const datos = JSON.parse(contenido);

                if (Array.isArray(datos)) {
                    // Iterar sobre los objetos JSON y procesar cada uno
                    datos.forEach((objeto) => {
                        procesarDatos(objeto);
                    });
                }

                // Confirmar el procesamiento del mensaje
                channel.ack(mensaje);
            }
        });

        console.log('Recibiendo datos de RabbitMQ...');
    } catch (error) {
        console.error('Error al recibir datos:', error);
    }
}

function verificarRegistrosDuplicados(matriz) {
    const archivoSalida = 'dat_datosIguales.json';
    const registrosVistos = new Set();
    //const registrosDuplicados = [];

    for (let i = 0; i < matriz.length; i++) {
        const [id, nombre, nacionalidad, cedula, direccion, telefono, correo] = matriz[i];
        const registroString = JSON.stringify({
            id,
            nombre,
            nacionalidad,
            cedula,
            direccion,
            telefono,
            correo
        });

        if (registrosVistos.has(registroString)) {
            if (!registrosDuplicados.some((r) => JSON.stringify(r) === registroString)) {
                registrosDuplicados.push({
                    id,
                    nombre,
                    nacionalidad,
                    cedula,
                    direccion,
                    telefono,
                    correo
                });
            }
        } else {
            registrosVistos.add(registroString);
        }
    }
    //matrizDuplicado = registrosDuplicados;
    if (registrosDuplicados.length > 0) {
        const jsonData = JSON.stringify(registrosDuplicados, null, 2);
        fs.writeFileSync(archivoSalida, jsonData, 'utf8');
        console.log(`Se encontraron registros duplicados y se guardaron en ${archivoSalida}`);
    } else {
        console.log('No se encontraron registros duplicados.');
    }
}

function guardaCedulaErronea(matrizVerificaCedula) {

    try {
        // Transformar los datos en el nuevo formato
        const datosFormateados = matrizVerificaCedula.map((datos) => {
            return {
                "id": datos[0],
                "nombre": datos[1],
                "nacionalidad": datos[2],
                "cedula": datos[3],
                "direccion": datos[4],
                "telefono": datos[5],
                "correo": datos[6]
            };
        });

        const datosUnicos = Array.from(new Set(datosFormateados.map(JSON.stringify))).map(JSON.parse);

        // Guardar los datos actualizados en el archivo JSON
        const jsonData = JSON.stringify(datosUnicos, null, 2);
        fs.writeFileSync('dat_cedulaInvalida.json', jsonData, 'utf8');
        console.log('Datos con cedula invalida guardados en el archivo dat_cedulaInvalida.json');
    } catch (error) {
        console.error('Error al guardar los datos iguales:', error);
    }
}


function eliminarRegistrosDuplicados(matriz, matrizDuplicado) {


    const registrosDuplicados = new Set(matrizDuplicado.map(JSON.stringify));

    const matrizFiltrada = matriz.filter((registro) => {
        return !registrosDuplicados.has(JSON.stringify(registro));
    });

    return matrizFiltrada;
}


function guardaMatriz(matriz) {
    try {

        // Transformar los datos en el nuevo formato
        const datosFormateados = matriz.map((datos) => {
            return {
                "id": datos[0],
                "nombre": datos[1],
                "nacionalidad": datos[2],
                "cedula": datos[3],
                "direccion": datos[4],
                "telefono": datos[5],
                "correo": datos[6]
            };
        });

        const matrizFiltrada = eliminarRegistrosDuplicados(datosFormateados, registrosDuplicados);

        const datosUnicos = Array.from(new Set(matrizFiltrada.map(JSON.stringify))).map(JSON.parse);

        // Guardar los datos actualizados en el archivo JSON
        const jsonData = JSON.stringify(datosUnicos, null, 2);
        fs.writeFileSync('dat_normal.json', jsonData, 'utf8');
        console.log('Datos con cedula valida guardados en el archivo dat_normal.json');

    } catch (error) {
        console.error('Error al guardar los datos en el archivo:', error);
    }
}


// Función para procesar los datos recibidos
async function procesarDatos(datos) {
    try {
        var { id, nombre, nacionalidad, cedula, direccion, telefono, correo } = datos;

        // Verificar que la cédula sea un número
        var esCedulaValida = /^\d+$/.test(cedula);

        if (esCedulaValida) {
            // Guardar los datos en una matriz
            var datosGuardados = [id, nombre, nacionalidad, cedula, direccion, telefono, correo];

            matrizDatos.push(datosGuardados);
            verificarRegistrosDuplicados(matrizDatos);
            guardaMatriz(matrizDatos);

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            var nuevaFormularioString = datosGuardados[0] + "," + datosGuardados[1] + "," + datosGuardados[2] + "," + datosGuardados[3] + "," + datosGuardados[4] + "," + datosGuardados[5] + "," + datosGuardados[6];
            //try {
            var url = `https://localhost:5230/guardar?nuevoFormularioString=${encodeURIComponent(nuevaFormularioString)}`;

            enviarSolicitudesSecuencialmente(url);

            /*console.log(url);

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const response = await axios.get(url);
            console.log("Solicitud enviada con éxito.");
            console.log("Respuesta del servidor:", response.data);
        } catch (error) {
            console.error("Error al realizar la solicitud:", error.message);
        }
        */
            console.log('Datos procesados y guardados:', cedula);
        } else {
            // Guardar los datos en una matriz
            var datosGuardados1 = [id, nombre, nacionalidad, cedula, direccion, telefono, correo];

            matrizDatos1.push(datosGuardados1);
            guardaCedulaErronea(matrizDatos1);

            console.log('La cédula no es válida:', cedula);
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
    }
}

async function enviarSolicitudesSecuencialmente(url) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        //const url = `https://localhost:5230/guardar?nuevoFormularioString=${encodeURIComponent(formulario)}`;
        const response = await axios.get(url);
        
        console.log(url);
        console.log("Solicitud enviada con éxito.");
        //console.log("Respuesta del servidor:", response.data);
    } catch (error) {
        if (error.response.status === 500) {
        console.error("Error al realizar la solicitud:", error.message);
        // Esperar 2 segundos antes de reintentar enviar la solicitud
        
            await delay(2000);
            // Volver a intentar enviar la solicitud
            await enviarSolicitudesSecuencialmente(url);
        }else{
            console.error("Error al realizar la solicitud:", error.message);
        }
    }
}
// Iniciar la recepción de datos
recibirDatos();

  // Ejemplo de uso

