//Verificar sesion
function verificarSesion(rolPermitido) {

    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));

    if (!sesion || sesion.rol !== rolPermitido) {
        window.location.href = 'index.html';
    }
}
