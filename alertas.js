// Obtener el mensaje de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const mensaje = urlParams.get('mensaje');
     if(mensaje != null){  
    // Mostrar la alerta utilizando SweetAlert
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: mensaje,
        confirmButtonText: 'Aceptar'
      });
    }