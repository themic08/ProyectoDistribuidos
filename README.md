# ProyectoDistribuidos
--Carpeta nodo1/nodo2/nodo3
  --Archivo dataBase.json: Archivo que hace de almacenamiento para los nodos seguidores en formato .json
  --Archivo liderSeguidor.js: Archivo que hace de servidor donde se almacena la lógica donde se leer un archivo .json que indica si el nodo es lider o seguidor y realiza las actividades de servidor.

--Archivo alertas.js: Es llamado desde el formulario php para que muestre los mensajes el formulario.
--Archivo configuracion.json: Es el archivo donde se configura quien es lider o seguidor de los nodos y si estan encendidos o apagados.
--Archivo consulta_cola.js: Es el servidor que veifica los mensajes en la cola rabbit, los discrima, separa los duplicados y los datos invalidos y luego los datos validos los envia al modulo de almacenamiento.
--Archivo dat_cedulaInvalida.json: Archivo .json donde se almacenan los registros con cedula invalida.
--Archivo dat_datosIguales.json: Archivo .json donde se almacenan los registros duplicados.
--Archivo dat_normal.json: Archivo log donde se almacenan los datos que van a ser procesados.
--Archivo estilo.css: Archivo de estilos del formulario.
--Archivo genera_formulario.php: Es el archivo del formulario donde se ingresan datos para crear el archiv .json que se va a enviar a la cola rabbit.
--Archivo index.html: Front del formulario.
--Archivo package.json: El archivo "package.json" es un archivo de configuración esencial en proyectos de Node.js que se utiliza para definir y administrar las dependencias, scripts, y metadatos del proyecto.
--Archivo registros.json: Archivo donde se guardan los datos capturados del formulario.
--Archivo sensaServidor.js: Archivo servidor que es el encargado de sensar y guardar los datos en el archivo configuracion.json.


**--------------------Archivos del Web aplication----------------------**
--Archivo WebApplication3.sln: Es un archivo de solución utilizado por Microsoft Visual Studio.
--Archivo Formulario.cs: Constructor del objeto formulario.
--Archivo FormularioController.cs: Archivo donde se tiene toda la logica de los microservicios:
guardar
eliminar
reemplazar
listarUno
listarTodo
litarCondicion
--Archivo launchSettings.json: Archivo donde se configura el puerto 5230.

