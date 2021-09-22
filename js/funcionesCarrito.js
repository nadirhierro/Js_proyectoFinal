// Función para emparejar carrito con Storage
const emparejarCarritoStorage = function () {
  // recupero carrito del localStorage
  let carritoStorageString = localStorage.getItem("carrito");
  let carritoStorage = JSON.parse(carritoStorageString);
  // si el carrito de storage no es null o vacío, entonces lo recupero y renderizo
  if (carritoStorage != null && carritoStorage.length != 0) {
    iniciarCarrito();
    // para cada producto del carrito
    carritoStorage.forEach((productoCarrito) => {
      let productoID = productoCarrito.id; // tomo el id
      let productoStock = productoCarrito.stock; // tomo stock y cantidad para emparejar con el array de productos
      let productoCantidad = productoCarrito.cantidad; // tomo la cantidad
      refreshContador("emparejar", productoCantidad);
      // me fijo qué producto es en producto y emparejo los datos
      productos.forEach((producto) => {
        if (producto.id == productoID) {
          producto["stock"] = parseInt(productoStock); // emparejo stock
          producto["cantidad"] = parseInt(productoCantidad); // emparejo cantidad
          carrito.push(producto); // ahora meto el producto al carrito
          renderizarEnCarrito(producto); // renderizo
          precioTotal += producto.precio * producto.cantidad; // calculo precio total
          actualizarTotal(precioTotal); // actualizo en carrito
        }
      });
    });
    escucharBotones();
    // si no había carrito
  } else {
    limpiarDOMcarrito();
  }
};

//función para renderizar en carrito
const renderizarEnCarrito = function (producto) {
  let precio = numberWithCommas(
    (producto.precio * producto.cantidad).toFixed(2)
  );
  $(".carrito").append(`
  <div
            id="carrito-${producto.id}"
            class="productoCarrito"
          >
            <div class="cajaImagen">
              <img
                src="./img/productos/${producto.id}.jpg"
                class="img-carrito"
                alt="${producto.descripcion}"
              />
            </div>
            <div class="infoProducto">
              <p class="texto">${producto.nombre}</p>
              <div class="precioYbotones">
                <div id="botones-${producto.id}" class="botones">
                    <i class="fas fa-minus-circle botonRestar"></i>
                    <p class="${producto.id}-cantidad texto">${producto.cantidad}</p>
                    <i class="fas fa-plus-circle botonSumar"></i>
                </div>
                <p class="${producto.id}-precio texto">$ ${precio}</p>
              </div>
            </div>
            <i class="fas fa-times-circle botonEliminar"></i>
          </div>
  `);
};

// función para animar producto en grilla
const animacionGrilla = function (id) {
  $(`#${id}`).css({
    "animation-name": "pulse",
    "animation-duration": "0.8s",
  });
  setTimeout(function () {
    $(`#${id}`).css({
      "animation-name": "none",
      "animation-duration": "0s",
    });
  }, 801);
};

// funciones para renderizar en tabla de finalizar compra
const renderizarTabla = function () {
  carrito.forEach((producto) => {
    let subtotal = numberWithCommas(
      (producto.precio * producto.cantidad).toFixed(2)
    );
    $(".tbody").append(`
      <tr id="carrito-${producto.id}" class="fila">
        <th class="cajaImagenTabla" scope="row">
          <img src="./img/productos/${producto.id}.jpg" alt="" />
        </th>
        <td>Encordado guitarra eléctrica D'addario Exp110 Nickle W</td>
        <td>
          <div id="botones-${producto.id}" class="botones">
            <i class="fas fa-minus-circle botonRestar"></i>
            <p class="${producto.id}-cantidad texto">${producto.cantidad}</p>
            <i class="fas fa-plus-circle botonSumar"></i>
          </div>
        </td>
        <td class="${producto.id}-precio">$ ${subtotal}</td>
        <td class="botonEliminar"><i class="fas fa-times-circle"></i></td>
      </tr>
    `);
  });
};
const renderizarTotalTabla = function () {
  let total = numberWithCommas(precioTotal.toFixed(2));
  $(".tbody").append(`
    <tr class="total">
      <td></td>
      <td></td>
      <td class="texto">TOTAL</td>
      <td class="totalPrecio">$ ${total}</td>
      <td></td></tr>
  `);
};
// función para cargar formulario de finalizar compra
const cargarFormulario = function () {
  $(".carritoYdatos").append(finalizarCompraFormulario);
};

// función para cambiar cantidad y precio en carrito
const refreshPrecioCantidad = function (producto) {
  let nuevaCantidad = producto.cantidad; // reviso la nueva cantidad (en la funcion agregarCarrito ya se actualizó)
  let nuevoPrecio = producto.precio * nuevaCantidad; // calculo el nuevo precio
  let nuevoPrecioFixed = numberWithCommas(nuevoPrecio.toFixed(2));
  $(`.${producto.id}-cantidad`).html(`${nuevaCantidad}`); // lo inserto en el DOM
  $(`.${producto.id}-precio`).html(`$${nuevoPrecioFixed}`); // lo inserto en el DOM
};

// función para refresh de array carrito
const refreshCarritoArray = function (producto, productoAborrar) {
  let indexEnCarrito = carrito.indexOf(productoAborrar); // tomo el index del producto en el carrito
  carrito.splice(indexEnCarrito, 1); // lo saco del carrito
  // vuelvo a ponerlo, pero ahora con la cantidad actualizada, si la cantidad es 0, no lo vuelvo a poner
  if (producto.cantidad >= 1) {
    carrito.push(producto);
  }
};

//función para refresh del Storage
const refreshLocalStorage = function (carrito) {
  localStorage.removeItem("carrito"); // lo saco para volver a ponerlo
  localStorage.setItem("carrito", JSON.stringify(carrito)); // guardo el carrito en sessionStorage
};

// función para calcular el total
const calcularTotal = function (nombreFuncion, precioProducto) {
  if (nombreFuncion == "restar") {
    precioTotal = precioTotal - precioProducto;
    precioTotal = parseFloat(precioTotal.toFixed(2));
  } else if (nombreFuncion == "sumar") {
    precioTotal += precioProducto;
    precioTotal = parseFloat(precioTotal.toFixed(2));
  }
};

// función para actualizar el total en el carrito
const actualizarTotal = function (precioTotal) {
  let precioTotalFixed = numberWithCommas(precioTotal.toFixed(2));
  $(".totalPrecio").html(`$ ${precioTotalFixed}`);
};

//función para "iniciar" el carrito
const iniciarCarrito = function () {
  $(".carritoContainer").append(filaTotal); // agrego fila de total
  $(".limpiarCarrito").on("click", limpiarCarrito); // escucho el botón de limpiar
  $(".comprarCarrito").on("click", comprarCarrito); // escucho el botón comprar
  $(".carritoVacio").remove(); // quito el mensaje de carrito vacío
  $(".carritoIconCaja").append(carritoContador); // agrego el contador
};

// función para limpiar carrito dom
const limpiarDOMcarrito = function () {
  $(".productoCarrito").remove(); // saco los productos del dom
  $(".carritoContador").remove(); // saco el contador
  $(".total").remove(); // saco la fila total del dom
  $(".botonesCarrito").remove(); // saco los botones
  $(".carrito").append(carritoVacio); // dejo mensaje de que está vacío
};
// función para limpiar tienda
const limpiarTienda = function () {
  $(".linksNav").remove();
  $(".hero").remove();
  $(".tienda").remove();
  $(".main").append(finalizarCompraHero);
  $(".main").append(finalizarCompraContainer);
  $(".carritoYdatos").append(finalizarCompraCarrito);
};

// funcion sumar contador
const refreshContador = function (nombreFuncion, cantidad) {
  switch (nombreFuncion) {
    case "sumar":
      contar++;
      break;
    case "restar":
      contar--;
      break;
    case "eliminar":
      contar -= cantidad;
      break;
    case "emparejar":
      contar += cantidad;
  }

  $(".carritoContador").html(`${contar}`); // sumo al contador
};

// función para sacar producto del dom carrito
const sacarNodo = function (id) {
  $(`#carrito-${id}`).remove();
};

// función para limpiar variables y Storage
const limpiarVariablesStorage = function () {
  carrito = [];
  localStorage.removeItem("carrito");
  precioTotal = 0;
  contar = 0;
};

// función para agregar producto al carrito
const agregarCarrito = function (event) {
  // si el carrito estaba vacío
  if (carrito.length == 0) {
    iniciarCarrito();
  }
  let productoID = ""; // inicializo productoID porque necesito saber si se está haciendo click en el carrito o en la grilla productos
  // si el tag es I, entonces busco el id según el DOM del carrito
  if ($(this).prop("tagName") == "I") {
    let productoCarritoID = $(this).parent().attr("id"); // rescato el id de producto
    productoID = productoCarritoID.replace("botones-", ""); // lo limpio de la palabra botones
  } else {
    // sino busco el id según el DOM de la grilla
    productoID = $(this).attr("id"); // busco el ID del producto seleccionado dentro del id del nodo
  }
  //busco el producto
  productos.forEach((producto) => {
    if (producto.id == productoID && producto.stock != 0) {
      // si hay stock
      producto.agregar(); // agrego cantidad y quito stock
      calcularTotal("sumar", producto.precio); // lo sumo al total
      actualizarTotal(precioTotal); // actualizo el total en el DOM carrito
      refreshContador("sumar"); // refresh al contador
      // me fijo si el tag es DIV (de la grilla productos) para en tal caso agregarle animación
      if ($(this).prop("tagName") == "DIV") {
        animacionGrilla(producto.id);
      }
      let productoAagregar = carrito.find(
        (producto) => producto.id == productoID
      ); // me fijo si ya está en el carrito
      if (productoAagregar == undefined) {
        // si no está
        carrito.push(producto); // guardo el producto en el carrito
        refreshLocalStorage(carrito); // refresh al LocalStorage
        renderizarEnCarrito(producto); // renderizo producto en DOM carrito
        escucharBotones(); // escucho botones
      } else {
        // si el producto ya está en el carrito
        refreshCarritoArray(producto, productoAagregar); // refresh al array
        refreshLocalStorage(carrito); // refresh al LocalStorage
        refreshPrecioCantidad(producto); // refresh a la cantidad y precio en DOM carrito
      }
    } else if (producto.id == productoID && producto.stock === 0) {
      alert("No hay Stock");
    }
  });
};

// función para borrar producto del carrito
const restarCarrito = function (event) {
  // selecciono al padre del botón restar, que tiene un id igual al id del producto
  let productoCarritoID = $(this).parent().attr("id"); // rescato el id de producto
  let productoID = productoCarritoID.replace("botones-", ""); // lo limpio de la palabra botones
  let productoArestar = carrito.find((producto) => producto.id == productoID); // lo busco en el carrito
  productos.forEach((producto) => {
    if (producto.id == productoID) {
      producto.borrar(); // actualizo cantidad y stock en array productos
      refreshCarritoArray(producto, productoArestar); // refresh al array carrito
      refreshLocalStorage(carrito); // refresh al LocalStorage
      calcularTotal("restar", producto.precio); // calculo el nuevo total
      actualizarTotal(precioTotal); // actualizo el total en el DOM carrito
      refreshContador("restar"); // refresh al contador
      if (producto.cantidad >= 1) {
        // Si todavía hay cantidad en el carrito
        refreshPrecioCantidad(producto); // refresh a precio y cantidad en DOM
      } else {
        // si no borro el nodo
        sacarNodo(producto.id);
      }
    }
  });
  // si el carrito quedó vacío
  if (carrito.length == 0) {
    limpiarDOMcarrito();
  }
};
const eliminarProducto = function (event) {
  // selecciono al padre del botón eliminar, que tiene un id igual al id del producto
  let productoCarritoID = $(this).parent().attr("id"); // rescato el id de producto
  let productoID = productoCarritoID.replace("carrito-", ""); // lo limpio de la palabra carrito
  let productoAborrar = carrito.find((producto) => producto.id == productoID); // lo busco en el carrito
  const productoCantidad = productoAborrar.cantidad; // guardo la cantidad para las iteraciones
  refreshContador("eliminar", productoCantidad);
  // busco el producto en array productos
  productos.forEach((producto) => {
    if (producto.id == productoID) {
      // borro cantidad tantas veces como sea necesario
      for (let i = 0; i < productoCantidad; i++) {
        producto.borrar();
      }
      refreshCarritoArray(producto, productoAborrar); // refresh al array carrito
      refreshLocalStorage(carrito); // refresh al LocalStorage
      calcularTotal("restar", producto.precio * productoCantidad); // calculo el nuevo total
      actualizarTotal(precioTotal); // actualizo el total en el DOM carrito
    }
  });
  sacarNodo(productoID);
  // si el carrito quedó vacío
  if (carrito.length == 0) {
    limpiarDOMcarrito();
  }
};

// función para limpiar el carrito
const limpiarCarrito = function (event) {
  // para cada producto que había sido seleccionado del array productos aplico el método borrar
  // tantas veces como cantidad se había seleccionado
  productos.forEach((producto) => {
    if (producto.cantidad != 0) {
      const cantidad = producto.cantidad; // guardo la cantidad en una constante, porque voy a modificar producto.cantidad con cada iteración
      for (let i = 0; i < cantidad; i++) {
        producto.borrar(); // descuento con el método
      }
    }
  });
  limpiarDOMcarrito();
  limpiarVariablesStorage();
};

// función para comprar
const comprarCarrito = function (event) {
  limpiarTienda();
  renderizarTabla();
  renderizarTotalTabla();
  escucharBotones();
  cargarFormulario();
};
