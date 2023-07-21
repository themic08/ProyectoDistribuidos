<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el número de formularios a generar
    $numFormularios = $_POST['num_formulario'];

    // Validar que se haya proporcionado un número válido
    if (!is_numeric($numFormularios) || $numFormularios < 1) {
        die('El número de formularios debe ser un valor numérico mayor o igual a 1.');
    }

    $formularios = [];
    date_default_timezone_set("America/Bogota");
    $fecha_actual = date("Ymd_his");

    // Generar los formularios
    for ($i = 1; $i <= $numFormularios; $i++) {
        $formulario = [
            'id' => $fecha_actual . "_".$_POST['txt_cedula'].$i,
            'nombre' => $_POST['txt_nombre'].$i,
            'nacionalidad' => $_POST['txt_nacionalidad'].$i,
            'cedula' => $_POST['txt_cedula'].$i,
            'direccion' => $_POST['txt_direccion'].$i,
            'telefono' => $_POST['txt_telefono'].$i,
            'correo' => $_POST['txt_correo'].$i
            
        ];
        $formularios[] = $formulario;
    }

    // Guardar los formularios en un archivo .json
    $json = json_encode($formularios, JSON_PRETTY_PRINT);
    $nombre_json='registros.json';
    file_put_contents($nombre_json, $json);
    $mensaje='Registros guardados correctamente en el archivo '.$nombre_json.'.';
    
    header("Location: procesa_json.js");

    header("Location: index.html?mensaje=".$mensaje);
    exit;
}
?>
