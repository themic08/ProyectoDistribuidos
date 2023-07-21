const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = '5231';

const JSON_PATH = path.join('C:', 'xampp', 'htdocs', 'Proyecto', 'configuracion.json');

// Crear el servidor
const server = http.createServer((req, res) => {
    // Leer el archivo JSON
    fs.readFile(JSON_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error en la validación.');
            return;
        }
        try {
            const jsonConfig = JSON.parse(data);
            let isLiderEncendido = false;

            var puertoLider = 0;
            var nodo;

            // Recorrer el JSON con forEach
            jsonConfig.forEach(server => {
                const { url, cargo, ultid, estado, puerto } = server;

                if (cargo === 'lider' && estado === 'encendido') {
                    puertoLider = puerto;
                }
            });

            jsonConfig.forEach(server => {
                const { url, cargo, ultid, estado, puerto } = server;

                if (puerto === PORT && cargo === 'lider' && estado === 'encendido') {
                    console.log(PORT + ' : ' + cargo);
                    console.log(__dirname);

                } else if (puerto === PORT && cargo === 'seguidor' && estado === 'encendido') {
                    console.log(PORT + ' : ' + cargo);
                    console.log(__dirname);
                    if (puertoLider != 0) {

                        if (puertoLider === "5231") {
                            nodo = "nodo1";
                        } else if (puertoLider === "5232") {
                            nodo = "nodo2";
                        } else if (puertoLider === "5233") {
                            nodo = "nodo3";
                        }

                        const inputFilePath = 'C:/xampp/htdocs/Proyecto/' + nodo + '/dataBase.json';
                        const outputFilePath = 'dataBase.json';

                        fs.readFile(inputFilePath, 'utf8', (err, data) => {
                            if (err) {
                                console.error('Error al leer el archivo JSON:', err.message);
                                return;
                            }

                            try {
                                // Analizar el JSON de entrada
                                const jsonData = JSON.parse(data);

                                // Convertir el nuevo JSON a formato de texto
                                const nuevoJSONString = JSON.stringify(jsonData, null, 2);

                                // Escribir el nuevo JSON en un archivo de salida
                                fs.writeFile(outputFilePath, nuevoJSONString, (err) => {
                                    if (err) {
                                        console.error('Error al escribir el archivo JSON de salida:', err.message);
                                    } else {
                                        console.log('Se ha creado el nuevo JSON en', outputFilePath);
                                    }
                                });
                            } catch (error) {
                                console.error('Error al analizar el JSON de entrada:', error.message);
                            }
                        });
                    }
                }
            });

            // Responder al cliente con la validación
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('¡Servidor líder encendido!');
        } catch (error) {
            console.error('Error al parsear el JSON:', error.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error en la validación.');
            return;
        }
    });
});

// Iniciar el servidor y escuchar en el puerto 5230
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}/`);
});
