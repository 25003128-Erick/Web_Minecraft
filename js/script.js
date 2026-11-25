const categoria = document.getElementById('categoria');
const buscar = document.getElementById('buscar');
const btnBuscar = document.getElementById('btnBuscar');
const resultados = document.getElementById('resultados');

const url = 'https://api.astroworldmc.com/api/v1/';

const sesion = JSON.parse(sessionStorage.getItem('sesionActiva')) || {};
const rol = sesion.rol || '';

//Consultar API
function cargarDatos() {

    const tipo = categoria.value;
    const nombre = encodeURIComponent(buscar.value.trim());

    resultados.innerHTML = '<p>Cargando información...</p>';

    fetch(url + tipo + '?search=' + nombre)
        .then(response => response.json())
        .then(data => {

            resultados.innerHTML = '';

            if (!data.success || !Array.isArray(data.data) ||
                data.data.length === 0) {

                resultados.innerHTML = '<p>No se encontraron resultados.</p>';
                return;
            }

            data.data.forEach(elemento => {

                let informacion = '';

                if (tipo === 'mobs') {
                    informacion = `
                        <p>Tipo: ${elemento.type ?? 'No disponible'}</p>
                        <p>Vida: ${elemento.hp ?? 'No disponible'}</p>
                        <p>Comportamiento: ${elemento.behavior ?? 'No disponible'}</p>
                    `;
                }

                if (tipo === 'biomes') {
                    informacion = `
                        <p>Dimensión: ${elemento.dimension ?? 'No disponible'}</p>
                        <p>Categoría: ${elemento.category ?? 'No disponible'}</p>
                        <p>Temperatura: ${elemento.temperature ?? 'No disponible'}</p>
                    `;
                }

                if (tipo === 'items') {
                    informacion = `
                        <p>Categoría: ${elemento.category ?? 'No disponible'}</p>
                        <p>Descripción: ${elemento.description ?? 'No disponible'}</p>
                        <p>Tamaño máximo: ${elemento.stackSize ?? 'No disponible'}</p>
                    `;
                }

                if (tipo === 'enchantments') {
                    informacion = `
                        <p>Categoría: ${elemento.category ?? 'No disponible'}</p>
                        <p>Nivel máximo: ${elemento.maxLevel ?? 'No disponible'}</p>
                        <p>Descripción: ${elemento.description ?? 'No disponible'}</p>
                    `;
                }

                resultados.innerHTML += `
                    <div class="tarjeta">
                        <h3>${elemento.name}</h3>
                        ${informacion}

                        ${rol === 'Usuario' ? `
                            <button class="btnFavorito"
                                data-name="${elemento.name}"
                                data-type="${tipo}">
                                Agregar a favoritos
                            </button>
                        ` : ''}
                    </div>
                `;
            });
        })
        .catch(error => {
            resultados.innerHTML = '<p>Error al consultar la API.</p>';
            console.log(error);
        });
}

//Guardar favoritos
function mostrarFavoritos() {

    const lista = document.getElementById('listaFavoritos');

    if (!lista) return;

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    lista.innerHTML = '';

    if (favoritos.length === 0) {
        lista.innerHTML = '<p>No tienes favoritos guardados.</p>';
        return;
    }

    favoritos.forEach(elemento => {
        lista.innerHTML += `
            <div class="tarjeta">
                <h3>${elemento.name}</h3>
                <p>Categoría: ${elemento.type}</p>

                <button class="btnEliminarFavorito"
                    data-name="${elemento.name}"
                    data-type="${elemento.type}">
                    Eliminar
                </button>
            </div>
        `;
    });
}

//Agregar y eliminar favoritos
resultados.addEventListener('click', function(e) {

    if (e.target.classList.contains('btnFavorito')) {

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

        const nombre = e.target.dataset.name;
        const tipo = e.target.dataset.type;

        const existe = favoritos.some(f =>
            f.name === nombre && f.type === tipo
        );

        if (!existe) {
            favoritos.push({
                name: nombre,
                type: tipo
            });

            localStorage.setItem('favoritos', JSON.stringify(favoritos));

            mostrarFavoritos();
            alert('Agregado a favoritos.');
        } else {
            alert('Este elemento ya está en favoritos.');
        }
    }
});

const listaFavoritos = document.getElementById('listaFavoritos');

if (listaFavoritos) {

    listaFavoritos.addEventListener('click', function(e) {

        if (e.target.classList.contains('btnEliminarFavorito')) {

            let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

            favoritos = favoritos.filter(f =>
                !(f.name === e.target.dataset.name &&
                  f.type === e.target.dataset.type)
            );

            localStorage.setItem('favoritos', JSON.stringify(favoritos));

            mostrarFavoritos();
        }
    });
}

//Mostrar recomendaciones
function mostrarRecomendaciones() {

    const lista = document.getElementById('listaRecomendaciones');

    if (!lista) return;

    const recomendaciones = JSON.parse(
        localStorage.getItem('recomendaciones')
    ) || [];

    lista.innerHTML = '';

    if (recomendaciones.length === 0) {
        lista.innerHTML = '<p>No hay recomendaciones.</p>';
        return;
    }

    recomendaciones.forEach(elemento => {

        lista.innerHTML += `
            <div class="tarjeta">
                <h3>${elemento.nombre}</h3>
                <p>${elemento.descripcion}</p>

                ${rol === 'Administrador' ? `
                    <button class="btnEliminarRecomendacion"
                        data-id="${elemento.id}">
                        Eliminar
                    </button>
                ` : ''}
            </div>
        `;
    });
}

//Agregar recomendaciones
const btnAgregar = document.getElementById('btnAgregar');

if (btnAgregar) {

    btnAgregar.addEventListener('click', function() {

        const nombre = document.getElementById('nombreRecomendacion');
        const descripcion = document.getElementById('descripcionRecomendacion');

        if (nombre.value.trim() === '' ||
            descripcion.value.trim() === '') {

            alert('Completa todos los campos.');
            return;
        }

        const recomendaciones = JSON.parse(
            localStorage.getItem('recomendaciones')
        ) || [];

        recomendaciones.push({
            id: Date.now(),
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim()
        });

        localStorage.setItem(
            'recomendaciones',
            JSON.stringify(recomendaciones)
        );

        nombre.value = '';
        descripcion.value = '';

        mostrarRecomendaciones();

        alert('Recomendación agregada.');
    });
}

//Eliminar recomendaciones
const listaRecomendaciones = document.getElementById('listaRecomendaciones');

if (listaRecomendaciones) {

    listaRecomendaciones.addEventListener('click', function(e) {

        if (e.target.classList.contains('btnEliminarRecomendacion')) {

            let recomendaciones = JSON.parse(
                localStorage.getItem('recomendaciones')
            ) || [];

            recomendaciones = recomendaciones.filter(r =>
                r.id !== Number(e.target.dataset.id)
            );

            localStorage.setItem(
                'recomendaciones',
                JSON.stringify(recomendaciones)
            );

            mostrarRecomendaciones();
        }
    });
}

//Eventos
btnBuscar.addEventListener('click', cargarDatos);

categoria.addEventListener('change', cargarDatos);

buscar.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        cargarDatos();
    }
});

//Carga inicial
mostrarFavoritos();
mostrarRecomendaciones();
cargarDatos();
