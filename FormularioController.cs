using Microsoft.AspNetCore.Mvc;
using System.Text.Json;


namespace WebApplication3.Controllers
{
    public class FormularioController : ControllerBase
    {
        [HttpGet]
        [Route("guardar")]
        public async Task<ActionResult> guardarFormulario(string nuevoFormularioString)
        {
            try
            {
                string nodo = ObtenerPuertoDelLider();
                string filePath = "C:\\xampp\\htdocs\\Proyecto\\" + nodo + "\\dataBase.json";
                // Convertir el string recibido a un array de strings utilizando la coma como separador
                string[] formularioArray = nuevoFormularioString.Split(',');

                if (formularioArray.Length != 7)
                {
                    return BadRequest("El formato del formulario es incorrecto. Se requieren 7 campos separados por comas.");
                }

                // Crear un nuevo objeto Formulario utilizando los campos del array
                Formulario nuevoFormulario = new Formulario
                {
                    id = formularioArray[0],
                    nombre = formularioArray[1],
                    nacionalidad = formularioArray[2],
                    cedula = formularioArray[3],
                    direccion = formularioArray[4],
                    telefono = formularioArray[5],
                    correo = formularioArray[6]
                };

                // Leer el contenido actual del archivo JSON
                string jsonString = System.IO.File.ReadAllText(filePath);

                // Deserializar el JSON en una lista de objetos Formulario
                List<Formulario> persons = JsonSerializer.Deserialize<List<Formulario>>(jsonString);

                // Verificar que no exista un formulario con el mismo ID
                bool existeId = persons.Any(p => p.id == nuevoFormulario.id);

                if (existeId)
                {
                    return Conflict($"Ya existe un formulario con el ID: {nuevoFormulario.id}");
                }
                else
                {
                    // Agregar el nuevo formulario a la lista
                    persons.Add(nuevoFormulario);

                    // Serializar la lista actualizada a JSON
                    string updatedJsonString = JsonSerializer.Serialize(persons, new JsonSerializerOptions { WriteIndented = true });

                    // Guardar el JSON actualizado en la ruta
                    System.IO.File.WriteAllText(filePath, updatedJsonString);

                    // Devolver una respuesta HTTP con el código 200 OK y el formulario agregado
                    return Ok(nuevoFormulario);
                }
            }
            catch (Exception ex)
            {
                // En caso de error, devolver una respuesta con el código 500 Internal Server Error
                return StatusCode(500, $"Error al agregar el formulario al archivo JSON: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("eliminar")]
        public dynamic eliminarFormulario(string id)
        {
            try
            {

                string nodo = ObtenerPuertoDelLider();
                string filePath = "C:\\xampp\\htdocs\\Proyecto\\" + nodo + "\\dataBase.json";

                // Leer el contenido del archivo JSON
                string jsonString = System.IO.File.ReadAllText(filePath);

                // Deserializar el JSON en una lista de objetos Person
                List<Formulario> persons = JsonSerializer.Deserialize<List<Formulario>>(jsonString);

                // Buscar el objeto con el id coincidente
                Formulario existingPerson = persons.FirstOrDefault(p => p.id == id);

                if (existingPerson != null)
                {
                    // Eliminar el objeto de la lista
                    persons.Remove(existingPerson);

                    // Serializar la lista actualizada a JSON
                    string updatedJsonString = JsonSerializer.Serialize(persons, new JsonSerializerOptions { WriteIndented = true });

                    // Guardar el JSON actualizado en la ruta
                    System.IO.File.WriteAllText(filePath, updatedJsonString);

                    // Devolver una respuesta HTTP con el código 200 OK
                    return Ok("Objeto eliminado correctamente.");
                }
                else
                {
                    // Si no se encuentra el objeto con el id coincidente, devolver una respuesta con el código 404 Not Found
                    return NotFound($"No se encontró la persona con el id: {id}");
                }
            }
            catch (Exception ex)
            {
                // En caso de error, devolver una respuesta con el código 500 Internal Server Error
                return StatusCode(500, $"Error al eliminar el objeto del archivo JSON: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("reemplazar")]
        public dynamic reemplazarFormulario([FromBody] Formulario personToUpdate)
        {

            try
            {
                string nodo = ObtenerPuertoDelLider();
                string filePath = "C:\\xampp\\htdocs\\Proyecto\\" + nodo + "\\dataBase.json";
                // Leer el contenido del archivo JSON
                string jsonString = System.IO.File.ReadAllText(filePath);

                // Deserializar el JSON en una lista de objetos Person
                List<Formulario> persons = JsonSerializer.Deserialize<List<Formulario>>(jsonString);

                // Buscar el objeto con el id coincidente
                Formulario existingPerson = persons.FirstOrDefault(p => p.id == personToUpdate.id);

                if (existingPerson != null)
                {
                    // Actualizar las propiedades del objeto existente con los datos recibidos
                    existingPerson.nombre = personToUpdate.nombre;
                    existingPerson.nacionalidad = personToUpdate.nacionalidad;
                    existingPerson.cedula = personToUpdate.cedula;
                    existingPerson.direccion = personToUpdate.direccion;
                    existingPerson.telefono = personToUpdate.telefono;
                    existingPerson.correo = personToUpdate.correo;

                    // Serializar la lista actualizada a JSON
                    string updatedJsonString = JsonSerializer.Serialize(persons, new JsonSerializerOptions { WriteIndented = true });

                    // Guardar el JSON actualizado en la ruta
                    System.IO.File.WriteAllText(filePath, updatedJsonString);

                    // Devolver una respuesta HTTP con el código 200 OK
                    return Ok("JSON actualizado correctamente.");
                }
                else
                {
                    // Si no se encuentra el objeto con el id coincidente, devolver una respuesta con el código 404 Not Found
                    return NotFound($"No se encontró la persona con el id: {personToUpdate.id}");
                }
            }
            catch (Exception ex)
            {
                // En caso de error, devolver una respuesta con el código 500 Internal Server Error
                return StatusCode(500, $"Error al actualizar el archivo JSON: {ex.Message}");
            }
            
        }

        [HttpGet]
        [Route("listarUno")]
        public dynamic listarUnoFormulario(string id)
        {
            try
            {
                string nodo = ObtenerPuertoDelLider();
                string filePath = "C:\\xampp\\htdocs\\Proyecto\\" + nodo + "\\dataBase.json";

                // Leer el contenido del archivo JSON
                string jsonString = System.IO.File.ReadAllText(filePath);

                // Deserializar el JSON en una lista de objetos Person
                List<Formulario> persons = JsonSerializer.Deserialize<List<Formulario>>(jsonString);

                // Buscar el objeto con el id especificado
                Formulario person = persons.FirstOrDefault(p => p.id == id);

                if (person != null)
                {
                    // Devolver el objeto encontrado como respuesta HTTP con el código 200 OK
                    return Ok(person);
                }
                else
                {
                    // Si no se encuentra el objeto, devolver una respuesta con el código 404 Not Found
                    return NotFound($"No se encontró la persona con el id: {id}");
                }
            }
            catch (Exception ex)
            {
                // En caso de error, devolver una respuesta con el código 500 Internal Server Error
                return StatusCode(500, $"Error al leer el archivo JSON: {ex.Message}");
            }

        }

        [HttpGet]
        [Route("listarTodo")]
        public dynamic listarTodoFormulario()
        {
            try
            {
                string nodo = ObtenerPuertoDelLider();
                string filePath = "C:\\xampp\\htdocs\\Proyecto\\" + nodo + "\\dataBase.json";
                // Leer el contenido del archivo JSON
                string jsonString = System.IO.File.ReadAllText(filePath);

                // Deserializar el JSON en un objeto dynamic
                dynamic resultado = JsonSerializer.Deserialize<dynamic>(jsonString);

                // Devolver el resultado como una respuesta HTTP con el código 200 OK
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // En caso de error, devolver una respuesta con el código 500 Internal Server Error
                return StatusCode(500, $"Error al leer el archivo JSON: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("litarCondicion")]
        public dynamic litarCondicionFormulario(string nombre)
        {
            try
            {
                string nodo = ObtenerPuertoDelLider();
                string filePath = "C:\\xampp\\htdocs\\Proyecto\\"+ nodo+"\\dataBase.json";

                // Leer el contenido del archivo JSON
                string jsonString = System.IO.File.ReadAllText(filePath);

                // Deserializar el JSON en una lista de objetos Person
                List<Formulario> persons = JsonSerializer.Deserialize<List<Formulario>>(jsonString);

                // Buscar los objetos con el nombre coincidente
                List<Formulario> matchingPersons = persons.Where(p => p.nombre == nombre).ToList();

                if (matchingPersons.Count > 0)
                {
                    // Devolver una respuesta HTTP con el código 200 OK y el listado de objetos encontrados
                    return Ok(matchingPersons);
                }
                else
                {
                    // Si no se encuentran objetos con el nombre coincidente, devolver una respuesta con el código 404 Not Found
                    return NotFound($"No se encontraron personas con el nombre: {nombre}");
                }
            }
            catch (Exception ex)
            {
                // En caso de error, devolver una respuesta con el código 500 Internal Server Error
                return StatusCode(500, $"Error al buscar personas por nombre en el archivo JSON: {ex.Message}");
            }
        }

        private static string ObtenerPuertoDelLider()
        {
            try
            {
                string jsonFilePath = "C:\\xampp\\htdocs\\Proyecto\\configuracion.json";

                // Leer el contenido del archivo JSON
                string jsonString = System.IO.File.ReadAllText(jsonFilePath);

                // Deserializar el JSON en una lista de objetos Servidor
                List<Servidor> servidores = JsonSerializer.Deserialize<List<Servidor>>(jsonString);

                // Buscar el objeto con el cargo "lider"
                Servidor lider = servidores.Find(s => s.cargo == "lider");

                // Verificar si se encontró el servidor con cargo "lider"
                if (lider != null)
                {
                    if (lider.puerto == "5232")
                    {
                        return "nodo2";
                    }
                    else if (lider.puerto ==  "5233")
                    {
                        return "nodo3";
                    }
                    else
                    {
                        return "nodo1";
                    }
                }
                else
                {
                    return "nodo1";
                    //throw new Exception("No se encontró un servidor con cargo de 'lider' en el JSON.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al leer el archivo JSON: {ex.Message}");
                return null;
            }
        }


        public class Formulario
        {
            public string id { get; set; }
            public string nombre { get; set; }
            public string nacionalidad { get; set; }
            public string cedula { get; set; }
            public string direccion { get; set; }
            public string telefono { get; set; }
            public string correo { get; set; }
        }

        public class Servidor
        {
            public string url { get; set; }
            public string cargo { get; set; }
            public string ultid { get; set; }
            public string estado { get; set; }
            public string puerto { get; set; }
        }
    }
}
