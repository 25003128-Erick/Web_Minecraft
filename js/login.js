//Base de usuarios local
const base = [
    {user: 'admin', pass: '1234', rol: 'Administrador', url: 'admin.html'},
    {user: 'usuario', pass: '2468', rol: 'Usuario', url: 'usuario.html'}
];

//Iniciar sesion
function iniciarSesion(e) {
    e.preventDefault();

    const inputUser = document.getElementById('inputUser').value.trim();
    const inputPass = document.getElementById('inputPass').value.trim();

    const usuarioAutenticado = base.find(
        u => u.user === inputUser && u.pass === inputPass
    );

    if (usuarioAutenticado) {

        //Almacenar datos en SESSIONSTORAGE
        sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioAutenticado));

        //Registrar acceso
        registrarAcceso();

        //Redirigir a la pagina correspondiente
        window.location.href = usuarioAutenticado.url;

    } else {
        document.getElementById('errorMsg').classList.remove('d-none');
    }
}

//Saltar login si ya esta autenticado
function saltarLoginSiAutenticado() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));

    if (sesion) {
        alert('Ya tienes una sesión iniciada como ' + sesion.rol);
        window.location.href = sesion.url;
    }
}

//Cerrar sesion
function cerrarSesion() {
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (confirmar) {
        sessionStorage.removeItem('sesionActiva');
        window.location.href = 'index.html';
    }
}

//Registrar acceso
function registrarAcceso() {
    let acceso = JSON.parse(sessionStorage.getItem('accesos')) || [];

    const fecha = new Date().toLocaleString('sv-SE');

    acceso.push('Acceso ' + (acceso.length + 1) + ': ' + fecha);

    sessionStorage.setItem('accesos', JSON.stringify(acceso));
}
