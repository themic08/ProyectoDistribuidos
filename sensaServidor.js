const http = require('http');
const fs = require('fs');

// Datos de los servidores
const servers = [
    {
        url: "http://localhost:5231/",
        cargo: "seguidor",
        ultid: "20",
        estado: "encendido",
        puerto: "5231"
    },
    {
        url: "http://localhost:5232/",
        cargo: "seguidor",
        ultid: "20",
        estado: "encendido",
        puerto: "5232"
    },
    {
        url: "http://localhost:5233/",
        cargo: "seguidor",
        ultid: "20",
        estado: "encendido",
        puerto: "5233"
    }
];

// Función para verificar el estado de los servidores
function verificarEstadoServidores() {

    const urls = [
        'http://localhost:5231/',
        'http://localhost:5232/',
        'http://localhost:5233/'
      ];
      async function hacerLlamadasHTTP() {
        for (const url of urls) {
          try {
            const response = await axios.get(url);
            console.log(`Respuesta de ${url}:`, response.data);
          } catch (error) {
            console.error(`Error al hacer la solicitud a ${url}:`, error.message);
          }
        }
      }
    var lider = "0";
    for (const server of servers) {
        const req = http.get(server.url, (res) => {
            server.estado = "encendido";
            if (lider === "0") {
                server.cargo = "lider";
                lider = "1";
            }
        });

        req.on('error', (error) => {
            server.estado = "apagado";
            server.cargo = "seguidor";
        });

        if (server.estado === "encendido"){
            if (lider === "0") {
                server.cargo = "lider";
                lider = "1";
            }else{
                server.cargo = "seguidor";
            }
        }

        req.on('close', () => {
            // Una vez que finaliza la solicitud, guardamos los datos actualizados en un archivo servers.json
            const jsonData = JSON.stringify(servers, null, 2);
            fs.writeFile('configuracion.json', jsonData, (err) => {
                if (err) {
                    console.error('Error al guardar el archivo servers.json:', err.message);
                } else {
                    console.log('Datos actualizados guardados en servers.json.');
                }
            });
        });

        req.end();
    }
}

// Ejecutar la verificación al inicio y cada 20 segundos después
verificarEstadoServidores();
setInterval(verificarEstadoServidores, 20000); // 20 segundos en milisegundos
