let carrito = [];
let seccionActual = '';
let temaOscuroActivado = false;



class Categoria {
    constructor(id, nombre, subCategorias){
        this.id = id;
        this.nombre = nombre;
        this.subCategorias = subCategorias;
    }
};

class Subcategoria {
    constructor(id, idCategoria, nombre, productos){
        this.id = id;
        this.idCategoria = idCategoria;
        this.nombre = nombre;
        this.productos = productos;
    }
};

class Producto {
    constructor(id, idSubCategoria, descripcion, stock, precio){
        this.id = id;
        this.idSubCategoria = idSubCategoria;
        this.descripcion = descripcion;
        this.stock = stock;
        this.precio = precio;
    }
};




// --- Funciones auxiliares

const obtenerPrecioTotalDelCarrito =()=> {
    return carrito.reduce ((total, item) => {
        const producto = buscarProductoPorId(item.id);
        return total + (producto.precio * item.cantidad);
    }, 0);
};

const buscarProductoPorId = id => {
    const producto = productos.find( productoBuscado => productoBuscado.id === id);
    return producto;
};



// --- Funciones auxilares para el contenedor principal

const obtenerContenedorPrincipal = () => {
    return document.getElementById("contenedorPrincipal");
};

const vaciarContenedorPrincipal = () => {
    const contenedorPrincipal = obtenerContenedorPrincipal();
    contenedorPrincipal.innerHTML = "";
};

const agregarElementoAlContenedorPrincipal = elemento => {
    const contenedorPrincipal = obtenerContenedorPrincipal();
    contenedorPrincipal.appendChild(elemento);
};



// --- Funciones para mostrar u ocultar
// --- la opcion de ordenar productos

const ocultarOpcionesDeOrdenDeProductos = function() {
    contItemsFiltros = document.getElementById("contItemsFiltros");

    contItemsFiltros.style.visibility = "hidden";
    contItemsFiltros.style.pointerEvents = "none";
};

const mostrarOpcionesDeOrdenDeProductos = function() {
    contItemsFiltros = document.getElementById("contItemsFiltros");

    contItemsFiltros.style.visibility = "visible";
    contItemsFiltros.style.pointerEvents = "auto";
};






// --------------------------------- Funciones para guardar y recuperar el carrito de localStorage ----------



const recuperarCarritoDeCompras = function() {
    const carritoGuardado = localStorage.getItem('carrito');
    // Si el array en localStorage existe, establecemos el array obtenido
    // como nuestro array de carrito actual
    if (carritoGuardado) {     
        carrito = JSON.parse(carritoGuardado);
    };
};

const guardarCarritoLocalmente = function() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};






// --------------------------- Funciones para recuperar las categorias ----------------------



let categorias = [];

const recuperarCategorias = async() =>{
    const origenDatos = './data/categorias.json';

    try {
        const response = await fetch(origenDatos);
        const datos = await response.json();
    
        categorias = datos; 
    } catch(error) {
        console.log("Error obteniendo las categorias. ", error);
    }
}






// --------------------------- Funciones para recuperar y establecer las subcategorias --------------------



let subCategorias = [];


// --- Funciones para cargar las subcategorias a
// --- sus respectivas categorias padre
const agregarSubcategoriaACategoria = (subcategoria, categoria) =>{
    if (subcategoria.idCategoria === categoria.id) {
        categoria.subCategorias.push(subcategoria);
    };
};

const cargarSubCategoriasACategorias = function() {
    categorias.forEach(categoria => {
        subCategorias.forEach(subcategoria => {
            agregarSubcategoriaACategoria(subcategoria, categoria);
        });
    });
};



const recuperarSubcategorias = async() => {
    const origenDatos = './data/subcategorias.json';
    
    try {
        const response = await fetch(origenDatos);
        datos = await response.json();
    
        subCategorias = datos;
    } catch(error) {
        console.log("Error obteniendo las subcategorias. ", error);
    }
}


const establecerSubcategorias = async() => {
    await recuperarSubcategorias();
    cargarSubCategoriasACategorias();
}






// --------------------------- Funciones para guardar y recuperar los productos  ------------------------



let productos = [];


/* Guarda el array de productos en local storage */
const guardarProductosLocalmente = function() {
    localStorage.setItem('productos', JSON.stringify(productos));
};


// --- Funciones para cargar los productos a
// --- sus respectivas subcategorias padre
const agregarProductoASubcategoria = function(producto, subcategoria) {
    if (producto.idSubCategoria === subcategoria.id) {
        subcategoria.productos.push(producto);
    };
};

const cargarProductosASubcategorias = function() {
    subCategorias.forEach(subcategoria => {
        productos.forEach(producto => {
            agregarProductoASubcategoria(producto, subcategoria);
        });
    });
}



const recuperarProductosDeURL = async() =>{
    const URL = './data/productos.json';
        try {
            const response = await fetch(URL);
            const datos = await response.json();
    
            productos = datos;
        } catch(error) {
            console.log("Error obteniendo los productos. ", error);
    };
};

const recuperarProductos = async() => {
    const productosGuardados = localStorage.getItem('productos');
    // Si existe la coleccion en local storage, establecemos esos productos
    // como nuestro array de productos actual
    if (productosGuardados) { 
        productos = JSON.parse(productosGuardados);
    } else {
        // Si no existe la coleccion de productos en local storage,
        // obtenemos la lista de productos desde la URL
        // (archivo JSON en este caso)
        await recuperarProductosDeURL();
    }
}


const establecerProductos = async() => {
    await recuperarProductos();
    cargarProductosASubcategorias();
    guardarProductosLocalmente();
}






// -------------- Funciones para manejar el cambio de tema ------------------------------- //


const cambiarImagenYColorAlBotonDeCambiarTema = function() {
    const botonCambiarTema = document.getElementById("botonTema");
    const imagenDeBotonCambiarTema = document.getElementById("imagenBotonTema");

    if (temaOscuroActivado == false) {
        imagenDeBotonCambiarTema.src="./assets/iconos/luna.png"
    } else {
        imagenDeBotonCambiarTema.src="./assets/iconos/sol.png"
    };
}


const establecerTemaAlIniciarLaApp = function() {
    if (temaOscuroActivado == true) {
        document.body.classList.toggle("temaOscuro");
    };
    cambiarImagenYColorAlBotonDeCambiarTema();
}

const recuperarTemaActivo = function() {
    const temaGuardado = sessionStorage.getItem('temaOscuroActivo');

    if (temaGuardado) {     
        temaOscuroActivado = JSON.parse(temaGuardado);
    };
};

const guardarTemaActivo = function() {
    sessionStorage.setItem('temaOscuroActivo', JSON.stringify(temaOscuroActivado));
};


const establecerColorDeBordeDeElementoSegunTemaActivo = elemento => {
    if (temaOscuroActivado == true) {
        elemento.classList.toggle("bordeTemaOscuro");
    };
};


const cambiarTemaActual =()=> {
    if (temaOscuroActivado == false) {
        temaOscuroActivado = true;
    } else {
        temaOscuroActivado = false;
    };
    guardarTemaActivo();
};




/* Funcion para manejar el boton que cambia el tema (Claro/oscuro) de la pagina */
const establecerComportamientoBotonTema = function () {
    const botonTema = document.getElementById("botonTema");
    botonTema.addEventListener("click", () => {
        
        cambiarTemaActual();
        cambiarImagenYColorAlBotonDeCambiarTema();
        // Añade la clase "temaOscuro" al body, la cual cambia su color fondo y de texto
        document.body.classList.toggle("temaOscuro"); 

        // Añade a todos los elementos de la pagina la clase "bordeTemaOscuro",
        // la cual cambia su color de borde
        const todosLosElementos = document.querySelectorAll('*');
        todosLosElementos.forEach(elemento => {
            elemento.classList.toggle("bordeTemaOscuro");
        });
    });
};






// --------------------------------- Funciones para generar la seccion de pago -------------------------



/*  Funcion para actualizar el texto de cantidad de items que se
    encuentra al lado del boton del carrito. */
const actualizarTextoCantidadItemsCarrito = function() {
    const textoCantItemsEnCarrito = document.getElementById('textoCantItemsEnCarrito');
    textoCantItemsEnCarrito.innerText = `(${carrito.reduce((total, producto) => total + producto.cantidad, 0)})`;
};


const vaciarCarrito =()=> carrito.length = 0;


/* Funcion para que, en caso de venta exitosa, se vacíe el carrito y se guarde localmente */
const actualizarCarritoDeCompras =()=> {
    vaciarCarrito();
    guardarCarritoLocalmente();
};


const descontarStockDeProductosVendidos = function() {
    carrito.forEach(productoEnCarrito => {
        productoADescontarStock = productos.find(prod => prod.id === productoEnCarrito.id);
        productoADescontarStock.stock -= productoEnCarrito.cantidad;
    })
    guardarProductosLocalmente();
}


const finalizarCompraExitosa = function() {
    descontarStockDeProductosVendidos();
    actualizarCarritoDeCompras();
    actualizarTextoCantidadItemsCarrito();
}


const crearConfirmacionDePago = function(nroTarjeta) {
    const precioTotal = obtenerPrecioTotalDelCarrito();
    const colorDeFondo = temaOscuroActivado ? 'linear-gradient(0deg, #191A1A, #343434)' : 'white' ;
    const colorDeTexto = temaOscuroActivado ? 'white' : 'black' ;

    Swal.fire({
        title: "¿Confirma la compra?",
        text: `Abona $${precioTotal.toLocaleString()} con la tarjeta número ${nroTarjeta}`,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#00800f",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        color: colorDeTexto,
        background: colorDeFondo,
        backdrop: 'rgba(0,0,0,0.7)'

    }).then((result) => {
        if (result.isConfirmed) {
            vaciarContenedorPrincipal();
            finalizarCompraExitosa();

            Swal.fire({
                title: "Compra realizada",
                text: `¡Muchas gracias! Sus productos llegaran pronto.`,
                icon: "success",
                confirmButtonText: "Volver al inicio",
                allowOutsideClick: false,
                color: colorDeTexto,
                background: colorDeFondo,
                backdrop: 'rgba(0,0,0,0.7)'
            }).then(result => {
                if (result.isConfirmed) {
                    renderizarTodosLosProductos();
                };
            });
        };
    });
}; 




// -------------------------- Funciones para generar la seccion de pago -------------------------


/* Funcion para obtener los valores ingresados en los inputs del form */
const obtenerDatos =()=> {
    const inputNombre = document.getElementById("nombre");
    const inputNroTarjeta = document.getElementById("nroTarjeta");
    const inputMesDeVencimiento = document.getElementById("mesDeVencimiento");
    const inputAnioDeVencimiento = document.getElementById("anioDeVencimiento");
    const inputCodigoSeguridad = document.getElementById("codigoSeguridad");

    const datos = [ // array con los valores
        inputNombre.value,
        inputNroTarjeta.value,
        inputMesDeVencimiento.value,
        inputAnioDeVencimiento.value,
        inputCodigoSeguridad.value,
    ]

    return datos;
}


// --------- Validaciones

/* Funcion que genera el texto de aviso de error de validacion en los inputs ingresados
   y les agrega la clase para que se muestre el borde rojo, por 3 segundos */
const generarErrorDeValidacion =(input, span, textoDeError)=> {
    input.classList.add('error');
    span.innerText = textoDeError;
    setTimeout(function() {
        span.innerText = "";
        input.classList.remove('error');
    }, 3000);
}


/* Funcion que valida que el codigo de seguridad de la tarjeta ingresada */
// - La cantidad de carateres tiene que ser igual a 3.

const validarCodigoSeguridad =(valor)=> {
    datos = obtenerDatos()
    valor = datos[4];

    if (/\D/.test(valor)) { // valida que el dato ingresado solo contenga números
        const span = document.getElementById("errorCodigoSeguridad");
        const inputNombre = document.getElementById("codigoSeguridad");
        generarErrorDeValidacion(inputNombre, span, "Solo se admiten números.");

    } else if (valor.length !== 3) { 
        const span = document.getElementById("errorCodigoSeguridad");
        const inputNombre = document.getElementById("codigoSeguridad");
        generarErrorDeValidacion(inputNombre,span, "Ingrese el código de 3 dígitos.");

    } else {
        crearConfirmacionDePago(datos[1]);
    };
};


/* Funcion que valida que el año de vencimiento de la tarjeta ingresado */
// - El input no puede estar vacio. 
// - El numero ingresado tiene que estar entre 1920 y 2006. 
const validarAnio =(valor)=> {
    valor = obtenerDatos()[3];

    if (valor==="") { 
        const span = document.getElementById("errorMensajeAnio");
        const inputNombre = document.getElementById("anioDeVencimiento");
        generarErrorDeValidacion(inputNombre, span, "Campo vacío.");

    } else if (valor < 1920 || valor > 2006) {
        const span = document.getElementById("errorMensajeAnio");
        const inputNombre = document.getElementById("anioDeVencimiento");
        generarErrorDeValidacion(inputNombre,span, "Año inválido.");

    } else {
        validarCodigoSeguridad();
    }
};


/* Funcion que valida que el mes de vencimiento de la tarjeta ingresado */
// - El input no puede estar vacio.
// - El numero ingresado tiene que estar entre 1 y 12.
const validarMes =(valor)=> {
    valor = obtenerDatos()[2];

    if (valor==="") { 
        const span = document.getElementById("errorMensajeMes");
        const inputNombre = document.getElementById("mesDeVencimiento");
        generarErrorDeValidacion(inputNombre, span, "Campo vacío.");

    } else if (valor < 1 || valor > 12) {
        const span = document.getElementById("errorMensajeMes");
        const inputNombre = document.getElementById("mesDeVencimiento");
        generarErrorDeValidacion(inputNombre, span, "Mes inválido.");

    } else {
        validarAnio();
    }
};


/* Funcion que valida que el numero de la tarjeta ingresada */
// - El dato ingresado solo puede contener numeros.
// - La cantidad de carateres tiene que ser igual a 16.
const validarTarjeta =(valor)=> {
    valor = obtenerDatos()[1]

    if (/\D/.test(valor)) { // valida que el dato ingresado solo contenga números
        const span = document.getElementById("errorNroTarjeta");
        const inputNombre = document.getElementById("nroTarjeta");
        generarErrorDeValidacion(inputNombre, span, "Solo se admiten números.");

    } else if (valor.length !== 16) {
        const span = document.getElementById("errorNroTarjeta");
        const inputNombre = document.getElementById("nroTarjeta");
        generarErrorDeValidacion(inputNombre, span, "Ingrese un número de 16 dígitos.");

    } else {
        validarMes();
    }
};


/* Funcion que valida que el nombre ingresado */
// - El input no puede estar vacio 
// - El dato ingresado solo puede contener letras.
const validarNombre =()=> {
    valor = obtenerDatos()[0];

    if (valor==="") { 
        const span = document.getElementById("errorMensajeNombre");
        const inputNombre = document.getElementById("nombre");
        generarErrorDeValidacion(inputNombre, span, "Campo vacío.");

    } else if (/[^a-zA-Z]/.test(valor)) { // valida que el dato ingresado solo contenga letras
        const span = document.getElementById("errorMensajeNombre");
        const inputNombre = document.getElementById("nombre");
        generarErrorDeValidacion(inputNombre, span, "Solo se admiten letras.");

    } else {
        validarTarjeta();
    }
};


    // Se crea el boton continuar de la seccion de pago, el cual envia a validar
    // los datos ingresados en el form
const crearBotonPagar = () => {
    const botonContinuar = document.createElement("button");
    botonContinuar.id = "bontonContinuar";
    botonContinuar.type = "submit";
    botonContinuar.innerText = "Pagar";
    botonContinuar.addEventListener("click", (event)=> {
        event.preventDefault();

        validarNombre();
    });

    const contenedorForm = document.getElementById("contenedorForm");
    contenedorForm.appendChild(botonContinuar);
};


const crearFormDeDatosDelPago = () => {
    const contenedorForm = document.createElement("form");
    contenedorForm.id = "contenedorForm"

    const contenedorDatos = document.createElement("div");
    contenedorDatos.id = "contenedorDatos";
    contenedorDatos.innerHTML = `
        <div id="datosSuperior">
            <div id="datosNombre">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" placeholder="Como aparece en la tarjeta">
                <span id="errorMensajeNombre" class="mensajeDeError"></span>
            </div>

            <div id="datosNroTarjeta">
                <label for="nroTarjeta">Número de la tarjeta</label>
                <input type="text" id="nroTarjeta" name="nroTarjeta" placeholder="16 dígitos">
                <span id="errorNroTarjeta" class="mensajeDeError"></span>
            </div>
        </div>

        <div id="datosInferior">
            <div id="datosFechaVencimiento">
                <label for="mesDeVencimiento">Fecha de vencimiento</label>
                <div id="inputsVencimiento">
                    <div id="inputMesVencimiento">
                        <input type="text" id="mesDeVencimiento" name="mesDeVencimiento" placeholder="Mes">
                        <span id="errorMensajeMes" class="mensajeDeError"></span>
                    </div>

                    <div id="inputAnioVencimiento">
                        <input type="text" id="anioDeVencimiento" name="anioDeVencimiento" placeholder="Año">
                        <span id="errorMensajeAnio" class="mensajeDeError"></span>
                    </div>
                </div>
            </div> 

            <div id="datosCodigoSeguridad">
                <label for="codigoSeguridad">Código de seguridad</label>
                <div id="inputCodigoSeguridad">
                    <input type="text" id="codigoSeguridad" name="codigoSeguridad" placeholder="3 dígitos">
                    <span id="errorCodigoSeguridad" class="mensajeDeError"></span>
                </div>
            </div>
        </div>
    `; 

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(contenedorDatos);
    contenedorForm.appendChild(contenedorDatos);

    agregarElementoAlContenedorPrincipal(contenedorForm); // Se agrega al DOM el form


};

const crearTituloSeccionPago = () => {
    const seccion = document.createElement("div");
    seccion.className = "contenedorTitulo"
    seccion.innerHTML = `<h2>Caja</h2>`;

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(seccion);

    agregarElementoAlContenedorPrincipal(seccion); // Se agrega al DOM el contenedor con el titulo
};


function renderizarSeccionPago() {
    vaciarContenedorPrincipal();
    crearTituloSeccionPago();
    crearFormDeDatosDelPago();
    crearBotonPagar();
};






// ------------------------ Funciones para manejar la cantidad de unidades de los productos desde el carrito-------------


const cambiarColorDeBotonDeAgregarUnidadAlFallar = boton => {
    boton.classList.add('ErrorAlAgregarUnidad');
    setTimeout(function() {
        boton.classList.remove('ErrorAlAgregarUnidad');
    }, 200);
}



const generarNotificacionDeProductoAgregadoAlCarrito = function() {
    Toastify({
        text: `Añadido al carrito` ,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "green",
        }
    }).showToast();
};

const generarNotificacionDeStockInsuficiente = function() {
    Toastify({
        text: 'No hay más unidades',
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #ad0000, #ad0000)",
        }
    }).showToast();
};



const indiceDelProductoEnElCarrito = producto => carrito.findIndex (item => item.id === producto.id);


const existeElProductoEnElCarrito = producto => {
    if (indiceDelProductoEnElCarrito(producto) != -1){
        return true;
    }
    return false;
};


const unidadesDelProductoEnElCarrito = producto => {
    if (existeElProductoEnElCarrito(producto)) {
        return carrito[indiceDelProductoEnElCarrito(producto)].cantidad
    }
    return 0;
};


const hayStockDeProducto = producto => producto.stock > unidadesDelProductoEnElCarrito(producto);


const actualizarSubtotalDelProducto = function(producto) {
    const textoSubtotal = document.getElementById(`subtotal${producto.id}`);
    const cantidadDeUnidadesEnElCarrito = carrito[indiceDelProductoEnElCarrito(producto)].cantidad;

    textoSubtotal.innerText = `Subtotal: $ ${(producto.precio*cantidadDeUnidadesEnElCarrito).toLocaleString()}`
};


const actualizarPrecioTotal = function() {
    const textoPrecioTotal = document.getElementById("textoPrecioTotalCarrito");
    const precioTotal = obtenerPrecioTotalDelCarrito();
  
    textoPrecioTotal.innerText = `Total: $ ${precioTotal.toLocaleString()}`;
};


const actualizarTextoCantidadActualDeProductoEnCarrito = function(producto){
    productoEnCarrito = carrito[indiceDelProductoEnElCarrito(producto)];

    const textoCantidadActual = document.getElementById(`cantidadActual${producto.id}`);
    textoCantidadActual.innerText = productoEnCarrito.cantidad;
};


const reducirUnaUnidadLaCantidadDeProductoEnElCarrito = function(producto)  {
    productoEnCarrito = carrito[indiceDelProductoEnElCarrito(producto)];

    // Si la cantidad de unidades del producto en el carrito es mayor a 1, se reducen
    // las unidades en 1. En caso de no querer ninguna unidad (0), se puede directamente
    // descartar el producto desde el boton de descartar
    if (productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad = Math.max(1, (productoEnCarrito.cantidad - 1));

        actualizarTextoCantidadItemsCarrito();
        actualizarTextoCantidadActualDeProductoEnCarrito(producto);
        actualizarSubtotalDelProducto(producto);
        actualizarPrecioTotal();
    
        guardarCarritoLocalmente();
    };
};


const aumentarUnaUnidadLaCantidadDeProductoEnElCarrito = function(producto, boton)  {
    productoEnCarrito = carrito[indiceDelProductoEnElCarrito(producto)];

    // Si hay stock disponible del producto, se añade al carrito
    if (hayStockDeProducto(producto)) { 
        productoEnCarrito.cantidad = productoEnCarrito.cantidad + 1;

        actualizarTextoCantidadItemsCarrito();
        actualizarTextoCantidadActualDeProductoEnCarrito(producto);
        actualizarSubtotalDelProducto(producto);
        actualizarPrecioTotal();

        guardarCarritoLocalmente();
    } else {
        generarNotificacionDeStockInsuficiente();
        cambiarColorDeBotonDeAgregarUnidadAlFallar(boton);
    }

};






// --------------------------------------- Funciones para agregar productos al carrito --------------------


const descontarStockDelProducto = producto => producto.stock -= 1;


/* Funcion para actualizar el texto de cantidad de stock restante del producto que
se acaba de agregar al carrito de compras. */
function actualizarStockDelProductoEnElDOM(producto) {
    const TextoDeStockAtualDelProducto = document.querySelector(`#${producto.id} .stockProducto`);
    TextoDeStockAtualDelProducto.innerText = `Stock: ${producto.stock}`;
};


const agregarProductoACarrito = function(producto, boton) {

    if (indiceDelProductoEnElCarrito(producto) !== -1) {
        carrito[indiceDelProductoEnElCarrito(producto)].cantidad += 1; // Si se encuentra el producto en el carrito, se aumenta su cantidad
    } else {
        carrito.push({id: producto.id, cantidad: 1}); //Se no se encuentra el producto en el carrito, se agrega
    }

    boton.innerHTML = `Agregar al carrito (${carrito[indiceDelProductoEnElCarrito(producto)].cantidad})`;

    guardarCarritoLocalmente();

    actualizarTextoCantidadItemsCarrito();
    generarNotificacionDeProductoAgregadoAlCarrito();
};


const comprobarSiHayStockParaAgregarAlCarrito = (producto, boton) => {
    if (hayStockDeProducto(producto)) {
        agregarProductoACarrito(producto, boton);
    } else {
        generarNotificacionDeStockInsuficiente();
    }
};






// ----------------------- Funciones para descartar productos del carrito ------------------



const quitarProductoDelCarrito = function(producto){
    const indiceDelProductoADescartar = carrito.findIndex(item => item.id === producto.id);

    // Si se encuentra el producto en el carrito, se devuelve la cantidad del producto
    // al stock del mismo, y luego se remueve del carrito
    if (indiceDelProductoADescartar !== -1) {
        carrito.splice(indiceDelProductoADescartar, 1);
      }
};

const descartarProductoDelCarrito = function(producto){
    quitarProductoDelCarrito(producto);
    actualizarTextoCantidadItemsCarrito(); 
    guardarCarritoLocalmente();
    renderizarCarritoDeCompras();
};






// -------------------- Funciones para generar el carrito -----------------------------------



const establecerComportamientoBotonReducirCantidad = function(producto) {
    reducirUnaUnidadLaCantidadDeProductoEnElCarrito(producto);
};

const establecerComportamientoBotonAumentarCantidad = function(producto, boton) {
    aumentarUnaUnidadLaCantidadDeProductoEnElCarrito(producto, boton);
};


// --- Funciones para mostrar y reducir/aumentar las unidades
//     de los productos en el carrito

const crearBotonReducirCantidad = function(producto) {
    const botonReducirCantidad = document.createElement("button");
    botonReducirCantidad.id = `botonReducirCantidad${producto.id}`;
    botonReducirCantidad.className = "botonReducirCantidad";
    botonReducirCantidad.innerText = "-";
    botonReducirCantidad.addEventListener("click", ()=> {
        establecerComportamientoBotonReducirCantidad(producto);
    });

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(botonReducirCantidad);

    return botonReducirCantidad;
};

const crearTextoCantidadActual = function(producto) {
    const textoCantidadActual  = document.createElement("span");
    textoCantidadActual.id = `cantidadActual${producto.id}`;
    textoCantidadActual.className = "cantidadActual";

    textoCantidadActual.innerText = `${carrito[indiceDelProductoEnElCarrito(producto)].cantidad}`;
    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(textoCantidadActual);

    return textoCantidadActual;
};


const crearBotonAumentarCantidad = function(producto) {
    const botonAumentarCantidad = document.createElement("button");
    botonAumentarCantidad.id = `botonAumentarCantidad${producto.id}`;
    botonAumentarCantidad.className = "botonAumentarCantidad";
    botonAumentarCantidad.innerText = "+";
    botonAumentarCantidad.addEventListener("click", ()=> {
        establecerComportamientoBotonAumentarCantidad(producto, botonAumentarCantidad);
    });

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(botonAumentarCantidad);

    return botonAumentarCantidad;
};


/* Funcion para renderizar en el Dom texto con la cantidad de unidades actual del producto
   en el carrito, asi como tambien los botones para aumentar o reducir dicha cantidad */
const crearCantidadDeProductoModificable = function(producto) {
    const contendor = document.getElementById(`contenedorCantidad${producto.id}`) // Obtenemos el contenedor padre

    // Se añaden los elementos al contenedor
    contendor.appendChild(crearBotonReducirCantidad(producto));
    contendor.appendChild(crearTextoCantidadActual(producto));
    contendor.appendChild(crearBotonAumentarCantidad(producto));
};


const crearBotonParaDescartarProductoDelCarrito = function(producto) {
    // Se genera el boton para descartar el producto del carrito
    const botonDescartarProducto = document.createElement("button");
    botonDescartarProducto.className = "botonesDescartarProducto";
    botonDescartarProducto.innerText = "Descartar";
    botonDescartarProducto.addEventListener("click", ()=> {
        descartarProductoDelCarrito(producto);
    });
    return botonDescartarProducto;
};


const crearBotonParaDescartarProductoYAgregarloASuContenedor = function(producto) {
    // Se obtiene su contenedor
    const contPrecioProducto = document.getElementById(`contenedorSubtotal${producto.id}`);
    // Se crear y se agrega el boton al contenedor del producto
    const botonParaDescartarProducto = crearBotonParaDescartarProductoDelCarrito(producto);
    contPrecioProducto.appendChild(botonParaDescartarProducto);
};


const renderizarProductoEnCarrito = function(productoEnCarrito, contenedor) {
    const producto = buscarProductoPorId(productoEnCarrito.id);

    // Se genera el codigo para para el DOM del producto del carrito, 
    // con su imagen, precio, cantidad y subtotal
    const contenedorProductoEnCarrito = document.createElement("div");
    contenedorProductoEnCarrito.className = "contenedorProductoEnCarrito";
    contenedorProductoEnCarrito.innerHTML = `
        <div class="contImagen">
            <img src="./assets/imgs_productos/${producto.id}.png">
        </div>
        <div class="contDescripcion">
            <p>${producto.descripcion}</p>
        </div>
        <div id="contenedorPrecio${producto.id}" class="contPrecio">
            <h3 class="valorProductoCarrito">$ ${producto.precio.toLocaleString()}</h3>
        </div>
        <div id="contenedorSubtotal${producto.id}" class="contenedorSubtotal">
            <div id="contenedorCantidad${producto.id}" class="contenedorCantidad">
                <span>Cantidad: </span>
            </div>
            <p id="subtotal${producto.id}" class="subtotalProductoCarrito">Subtotal: $ ${(producto.precio*carrito[indiceDelProductoEnElCarrito(producto)].cantidad).toLocaleString()}</p>
        </div>`;

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(contenedorProductoEnCarrito);
    contenedor.appendChild(contenedorProductoEnCarrito);

    crearCantidadDeProductoModificable(producto);
    crearBotonParaDescartarProductoYAgregarloASuContenedor(producto);
};


const mostrarProductosEnCarrito = function() {
    const contenedorPrincipal = obtenerContenedorPrincipal();

    // Se renderiza cada uno de los productos del carrito
    carrito.forEach(producto => {
            renderizarProductoEnCarrito(producto, contenedorPrincipal);
    });
};


const mostrarPrecioTotalEnCarrito = function() {
    const contenedorPrecioTotalCarrito = document.createElement("div");
    contenedorPrecioTotalCarrito.id = "contenedorPrecioTotalCarrito";

    const precioTotal = obtenerPrecioTotalDelCarrito();
  
    contenedorPrecioTotalCarrito.innerHTML = `<h2 id="textoPrecioTotalCarrito">Total: $ ${precioTotal.toLocaleString()}</h2>`;

    agregarElementoAlContenedorPrincipal(contenedorPrecioTotalCarrito);
};


const crearBotonIrACaja = function() {
    const botonPagarCarrito = document.createElement("button");
    botonPagarCarrito.id="botonPagarCarrito";
    botonPagarCarrito.innerText= "Ir a caja";

    botonPagarCarrito.addEventListener("click", () => {
        renderizarSeccionPago();
    });

    const contenedorPrecioTotalCarrito = document.getElementById("contenedorPrecioTotalCarrito");
    contenedorPrecioTotalCarrito.appendChild(botonPagarCarrito);
};


/* Funcion para mostrar aviso de que el carrito de compras no contiene productos */
const mostrarAvisoDeCarritoVacio = function() {
    const avisoDeCarritoVacio = document.createElement("div");
    avisoDeCarritoVacio.id = "contTextoAvisoCarritoVacio";
    avisoDeCarritoVacio.innerHTML = '<h2>No hay productos en el carrito</h2>';

    agregarElementoAlContenedorPrincipal(avisoDeCarritoVacio);
};

const generarConfirmacionDeDescarteDeProductosDelCarrito = function() {
    const colorDeFondo = temaOscuroActivado ? 'linear-gradient(0deg, #191A1A, #343434)' : 'white' ;
    const colorDeTexto = temaOscuroActivado ? 'white' : 'black' ;

    Swal.fire({
        title: "¿Descartar todos los productos?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: "#00800f",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        color: colorDeTexto,
        background: colorDeFondo,
        backdrop: 'rgba(0,0,0,0.7)'
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarCarritoDeCompras(); // Se vacia el carrito y se guarda localmente
            actualizarTextoCantidadItemsCarrito();
            renderizarCarritoDeCompras();
        };
    });
};


const crearBotonDescartarTodo = function(){
    const botonDescartarTodo = document.createElement("button");
    botonDescartarTodo.id = "botonDescartarTodo"
    botonDescartarTodo.innerText = 'Vaciar carrito';
    botonDescartarTodo.addEventListener('click', ()=>{
        generarConfirmacionDeDescarteDeProductosDelCarrito();
    })

    return botonDescartarTodo;
};


const comprobarSiHayProductosEnElCarrito = function() {
    // Si el carrito tiene productos, se renderizan en el DOM
    if (carrito.length > 0) {
        const TituloSeccionCarrito = document.getElementById("tituloSeccionCarrito");

        TituloSeccionCarrito.appendChild(crearBotonDescartarTodo());
        mostrarProductosEnCarrito();
        mostrarPrecioTotalEnCarrito();
        crearBotonIrACaja();
    } else {
        mostrarAvisoDeCarritoVacio();
    };
};


function renderizarCarritoDeCompras() {

    vaciarContenedorPrincipal();
    ocultarOpcionesDeOrdenDeProductos(); 

    const contenedorPrincipal = obtenerContenedorPrincipal();
    contenedorPrincipal.style.display ="flex"
    contenedorPrincipal.style.flexDirection = "column"

    const TituloSeccion = document.createElement("div");
    TituloSeccion.id = "tituloSeccionCarrito";
    TituloSeccion.className = "contenedorTitulo"
    TituloSeccion.innerHTML = `<h2>Carrito</h2>`;

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(TituloSeccion);

    agregarElementoAlContenedorPrincipal(TituloSeccion);

    comprobarSiHayProductosEnElCarrito();
};






// ------------------------------ Funciones para generar el contenido de las categorias -----------------



const obtenerIDEnNumero = producto => parseInt(producto.id.slice(1));

/* Funciones para establecer el orden de los productos en su array */
function ordenarPorID(array) {
    array.sort((item1, item2) => obtenerIDEnNumero(item1) - obtenerIDEnNumero(item2));
};

function ordenarPorMasNuevos(array) {
    array.sort((item1, item2) => obtenerIDEnNumero(item2) - obtenerIDEnNumero(item1));
};

function ordenarPorMenorPrecio(array) {
    array.sort((item1, item2) => item1.precio - item2.precio);
};

function ordenarPorMayorPrecio(array) {
    array.sort((item1, item2) => item2.precio - item1.precio);
};


/* Funcion para obtener la seleccion de orden de los productos desde el DOM */
function ordenarProductos(array) {
    const objetoOrden = document.getElementById('orden');
    const opcionSeleccionada = objetoOrden.value;

    switch (opcionSeleccionada) {
        case "Id":
            ordenarPorID(array);
            break;
        case "Más nuevos":
            ordenarPorMasNuevos(array);
            break;
        case "Menor precio":
            ordenarPorMenorPrecio(array);
            break;
        case "Mayor precio":
            ordenarPorMayorPrecio(array);
            break;
    };
};


/* Funcion para obtener el nombre de la categoria padre de una subcategoria */
const obtenerNombreDeCategoriaPadre = function(subCategoria) {
    let nombreCategoriaPadre = ""
    categorias.forEach( categoria => {
        if (categoria.id === subCategoria.idCategoria) {
            nombreCategoriaPadre = categoria.nombre;
        }
    });
    return nombreCategoriaPadre;
};


/* Funcion para crear y agregar el titulo de la seccion. */
const crearTituloDeSeccion = function(seccionSeleccionada, contenedor) {
    const nombreDeCategoriaPadre = obtenerNombreDeCategoriaPadre(seccionSeleccionada);

    const seccion = document.createElement("div");
    seccion.className = "contenedorTitulo"
    seccion.innerHTML = `<p>${nombreDeCategoriaPadre}<p><h2>${seccionSeleccionada.nombre}</h2>`;

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(seccion);

    contenedor.appendChild(seccion);  // Se agrega al DOM el contenedor con el titulo
};


const renderizarBotonAgregarAlCarrito = function(producto) {
    let contenidoDelBoton = 'Agregar al carrito';

    if (existeElProductoEnElCarrito(producto)) {
        contenidoDelBoton = `Agregar al carrito (${unidadesDelProductoEnElCarrito(producto)})`;
    } 

    const botonAgregarAlCarrito = document.createElement("button");
    botonAgregarAlCarrito.className = "botonAgregarAlCarrito";
    botonAgregarAlCarrito.innerText = contenidoDelBoton;

    botonAgregarAlCarrito.addEventListener("click", () =>{
        comprobarSiHayStockParaAgregarAlCarrito(producto, botonAgregarAlCarrito);
    });

    productoAInsertarBoton = document.getElementById(`contInferior${producto.id}`);
    productoAInsertarBoton.appendChild(botonAgregarAlCarrito);
};


const generarModalConImagenDeProducto = function(producto) {
    const colorDeFondo = temaOscuroActivado ? 'linear-gradient(0deg, #191A1A, #343434)' : 'white' ;
    const colorDeTexto = temaOscuroActivado ? 'white' : 'black' ;

    Swal.fire({
        title: `${producto.descripcion}`,
        text: `$ ${producto.precio.toLocaleString()}`,
        imageUrl: `./assets/imgs_productos/${producto.id}.png`,
        imageHeight: 650,
        imageAlt: `Imagen ${producto.descripcion}`,
        showCloseButton: true,
        showConfirmButton: false,
        color: colorDeTexto,
        background: colorDeFondo,
        backdrop: 'rgba(0,0,0,0.7)'
    });
};

const configurarComportamientoDeImagenDeProducto = function(producto) {
    const imagen = document.getElementById(`img${producto.id}`);
    imagen.addEventListener('click', ()=>{
        generarModalConImagenDeProducto(producto);
    });
};

const configurarColorTextoStockDeProducto = function(producto) {
    const contenedorTextoStock = document.getElementById(`contStock${producto.id}`);
    if (producto.stock === 0) {
        contenedorTextoStock.style.color = "red";
    }
}


const renderizarProducto = function(producto, contenedor) {
    // Se genera el contenedor del producto y dentro de él,
    // la imagen, descripcion, precio y stock
    const productoAAgregar = document.createElement("div");
    productoAAgregar.className = "contenedorProducto";
    productoAAgregar.id = `${producto.id}`;
    productoAAgregar.innerHTML =`
        <div class="contenImgProductos">
            <img id="img${producto.id}" src="./assets/imgs_productos/${producto.id}.png"> 
        </div>
        <div class="contDescripcion">
            <p class="descripcionProducto">${producto.descripcion}</p>
        </div>
        <div class="contPrecio">
            <p class="precioProducto">$ ${producto.precio.toLocaleString()}</p>
        </div>
        <div id="contInferior${producto.id}" class="contInferiorProductos">
            <p id="contStock${producto.id}" class="stockProducto">Stock: ${producto.stock}</p>
        </div>
    `;

 

    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(productoAAgregar);

    contenedor.appendChild(productoAAgregar); // Se agrega al DOM el contenedor con el producto

    configurarComportamientoDeImagenDeProducto(producto);
    configurarColorTextoStockDeProducto(producto);

    // Se agrega en boton para agregar al carrito el producto
    renderizarBotonAgregarAlCarrito(producto);
};


const renderizarSubcategoria = function(subCategoriaSeleccionada) {
    seccionActual=`${subCategoriaSeleccionada.nombre}`;
    const contenedorPrincipal = obtenerContenedorPrincipal();
    
    vaciarContenedorPrincipal();
    contenedorPrincipal.style.display ="grid";
    mostrarOpcionesDeOrdenDeProductos(); // Se hace visible la opcion de orden

    crearTituloDeSeccion(subCategoriaSeleccionada, contenedorPrincipal); // Se agrega al DOM el titulo de la seccion

    // Antes de renderizar los productos, se ordena la ubicacion de cada uno
    // en el array de productos en base al orden seleccionado
    ordenarProductos(subCategoriaSeleccionada.productos);

    // Se renderiza cada producto de la categoria seleccionada
    subCategoriaSeleccionada.productos.forEach( producto => {
        renderizarProducto(producto, contenedorPrincipal);
    });
};


function renderizarTodosLosProductos() {
    seccionActual="Todos los productos";
    mostrarOpcionesDeOrdenDeProductos(); // Se hace visible la opcion de orden
    vaciarContenedorPrincipal();

    const contenedorPrincipal = obtenerContenedorPrincipal();
    contenedorPrincipal.style.display ="grid";
    vaciarContenedorPrincipal();

    // Se genera el titulo de la seccion
    const TituloSeccion = document.createElement("div");
    TituloSeccion.className = "contenedorTitulo"
    TituloSeccion.innerHTML = `<h2>Todos los productos</h2><p>`;
    
    // En base al tema seleccionado (claro/oscuro), se añade
    // una clase al elemento para determinar el color de su borde
    establecerColorDeBordeDeElementoSegunTemaActivo(TituloSeccion);

    // Se agrega al DOM el titulo de la seccion
    agregarElementoAlContenedorPrincipal(TituloSeccion);

    // Antes de renderizar los productos, se ordena la ubicacion de cada uno
    // en el array de productos en base al orden seleccionado
    ordenarProductos(productos);

    // Se renderizan todos los productos
    productos.forEach( producto => {
        renderizarProducto(producto, contenedorPrincipal);
    });
};






// -------------------------- Funciones para crear el nav ---------------------------- 



const ordenarPorNombreAlfabeticamente = unArray => {
    unArray.sort((item1, item2) => item1.nombre.localeCompare(item2.nombre));
};


const cantidadDeSubcategorias = unaCategoria => unaCategoria.subCategorias.length


const crearNav = function() {
    // Por cada categoria se crea un item 
    categorias.forEach( categoria => {
        const categoriaAAgregar = document.createElement("li");
        categoriaAAgregar.className = "categoriaNav";
        categoriaAAgregar.innerHTML = categoria.nombre

        // Si la categoria tiene subcategorias, se generan 
        if (cantidadDeSubcategorias(categoria) > 0) {

            const subLista = document.createElement("ul"); // Lista que contendra las subcategorias
            subLista.className = "listaDesplegable";   
            
            ordenarPorNombreAlfabeticamente(categoria.subCategorias);
            
            // Por cada categoria se crea un item
            categoria.subCategorias.forEach( subCategoria => {
                const subCategoriaAAgregar = document.createElement("li");
                subCategoriaAAgregar.className = "subCategoriaNav";
                subCategoriaAAgregar.innerHTML = subCategoria.nombre;

                subLista.appendChild(subCategoriaAAgregar); 
            });

            categoriaAAgregar.appendChild(subLista);
        }; 

        // Se agrega la categoria al contenedor 
        const listaCategorias = document.getElementById("listaCategorias");
        listaCategorias.appendChild(categoriaAAgregar);
    });
};


/* Se obtiene la seccion actual, a fin de poder renderizarla nuevamente
cuando se cambia el orden de los productos mostrados */
const obtenerSeccionActual = function() {
    let seccionARenderizar = "Todos los productos";

    subCategorias.forEach( subcategoria =>{
        if (seccionActual === subcategoria.nombre) {
            seccionARenderizar = subcategoria;
        };
    });
    return seccionARenderizar;
};


/* Se establece la accion del cambio de opcion seleccionada del select 
del DOM, el cual establece el orden de los productos mostrados */
const establecerComportamientoDeOpcionesDeOrdenDeProducto = function() {
    const objetoOpciones = document.getElementById("orden");

    objetoOpciones.addEventListener("change", () =>{
        const seccionActual = obtenerSeccionActual();

        if (seccionActual === "Todos los productos") {
            renderizarTodosLosProductos();
        } else {
            renderizarSubcategoria(seccionActual);
        }
    })
}


/* Se establece la renderizacion de todos los productos en el DOM
cuando se hace click en boton "Todos los productos" del nav */
const establecerComportamientoBotonMostrarTodos = function() {
    const botonMostrarTodos = document.getElementById("botonMostrarTodos");

    botonMostrarTodos.addEventListener("click", ()=> {
        renderizarTodosLosProductos();
    });
};


/* Se establece la renderizacin del carrito de compras en el DOM
cuando se hace click en boton del carrito del nav */
const establecerComportamientoBotonCarrito = function() {
    const botonCarrito = document.getElementById("botonCarrito");

    botonCarrito.addEventListener("click", ()=> {
        renderizarCarritoDeCompras();
    });
};

const establecerComportamientoCategoriasDelNav = function(){

    establecerComportamientoBotonMostrarTodos();

/*  Se obtienen del DOM las subcategorias del nav */
    const subcategoriasNavColeccion = document.getElementsByClassName("subCategoriaNav");
    const subcategoriasNav = Array.from(subcategoriasNavColeccion);

/*  Por cada una, se programa la accion de click para renderizar en el DOM
    la subcategoria seleccionada */
    subcategoriasNav.forEach( item => {
        const nombreItem = item.innerText;

        categorias.forEach(categoria => {
            categoria.subCategorias.forEach(subCategoria => {
                if(nombreItem === subCategoria.nombre) {
                    item.addEventListener(
                        "click", () => renderizarSubcategoria(subCategoria)
                    )
                };
            });
        });
    });
};


const generarYEstablecerComportamientoDelNav = function() {
    crearNav();
    establecerComportamientoDeOpcionesDeOrdenDeProducto();
    establecerComportamientoCategoriasDelNav();
    establecerComportamientoBotonCarrito();
};


const establecerCategoriasSubcategoriasYProductos = async() => {
    await recuperarCategorias();
    await establecerSubcategorias();
    await establecerProductos();
};


const correrApp = async function() {
    recuperarTemaActivo();
    establecerTemaAlIniciarLaApp();
    establecerComportamientoBotonTema();

    recuperarCarritoDeCompras();
    actualizarTextoCantidadItemsCarrito();

    await establecerCategoriasSubcategoriasYProductos();
    generarYEstablecerComportamientoDelNav();
    renderizarTodosLosProductos();
};


correrApp();