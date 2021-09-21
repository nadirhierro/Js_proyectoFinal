// variables globales
let carrito = [];
let precioTotal = 0;
let contar = 0;
let productosFiltrados = []; // inicializo array de productos filtrados
let productosSubFiltrados = []; // inicializo array de productos subfiltrados
let productosBuscados = []; // inicializo array de productos buscados
// estructuras html estáticas
let loader = $(`
<div class="container-fluid">
<div class="row justify-content-center pt-5 loader">
<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
</div>
</div>
`);
let grillaTienda = $(`
  <div class="container-fluid tienda"></div>
  `).hide();

let barraBusqueda = $(`
  <div class="row">
    <div class="col-12 barraBusqueda">
    <h3>Buscá los productos de tu interés</h3>
    <form onsubmit="return false" class="buscador">
      <input
        type="search"
        id="input"
        class="form-control"
        placeholder="Buscar..."
        aria-label="Search"
      />
    </form>
    </div>
    </div>`);

let rowFiltrosProductos = $(`<div class="row filtrosProductos"></div>`);
let filtros = $(`
  <div class="col-2 filtros">
    <h3>Filtros</h3>
    <div class="categorias">
    <ul class="categoriaContenedor">
      <li class="categoria">Guitarras</li>
      <ul class="subcategorias">
        <li class="subcategoria">Guitarras Criollas</li>
        <li class="subcategoria">Guitarras Acústicas</li>
        <li class="subcategoria">Guitarras Eléctricas</li>
        <li class="subcategoria">Amplificadores para Guitarra</li>
        <li class="subcategoria">Encordados para Guitarra</li>
        <li class="subcategoria">Accesorios para Guitarra</li>
        <h5>Marcas</h5>
        <li class="subcategoria marca">Fender</li>
        <li class="subcategoria marca">Gibson</li>
        <li class="subcategoria marca">Ibanez</li>  
      </ul>
    </ul>
    <ul class="categoriaContenedor">
      <li class="categoria">Bajos</li>
      <ul class="subcategorias">
        <li class="subcategoria">Bajos Acústicos</li>
        <li class="subcategoria">Bajos Eléctricos</li>
        <li class="subcategoria">Amplificadores para Bajo</li>
        <li class="subcategoria">Encordados para Bajo</li>
        <li class="subcategoria">Accesorios para Bajo</li>
        <h5>Marcas</h5>
        <li class="subcategoria marca">Fender</li>
        <li class="subcategoria marca">Ibanez</li>  
      </ul>
    </ul>
    <ul class="categoriaContenedor">
      <li class="categoria">Teclados</li>
      <ul class="subcategorias">
        <li class="subcategoria">Digitales</li>
        <li class="subcategoria">Pianos</li>
        <li class="subcategoria">Sintetizadores</li>
        <li class="subcategoria">Amplificadores para Teclados</li>
        <li class="subcategoria">Accesorios para Teclados</li>
      </ul>
    </ul>
    <ul class="categoriaContenedor">
      <li class="categoria">Baterias</li>
      <ul class="subcategorias">
        <li class="subcategoria">Baterías Acústicas</li>
        <li class="subcategoria">Baterías Electrónicas</li>
        <li class="subcategoria">Percusión</li>
        <li class="subcategoria">Platillos</li>
        <li class="subcategoria">Accesorios</li>
      </ul>
    </ul>
    <ul class="categoriaContenedor">
      <li class="categoria">Estudio</li>
      <ul class="subcategorias">
        <li class="subcategoria">Auriculares</li>
        <li class="subcategoria">Consolas</li>
        <li class="subcategoria">Micrófonos</li>
        <li class="subcategoria">Monitores</li>
        <li class="subcategoria">Accesorios</li>
      </ul>
    </ul>
  </div>`);

let grillaProductos = $(`
  <div class="col-10 grillaProductos"></div>
  `);

let carritoOffcanvas = $(`
  <div
    class="offcanvas offcanvas-end"
    data-bs-scroll="true"
    data-bs-backdrop="false"
    tabindex="-1"
    id="offcanvasScrolling"
    aria-labelledby="offcanvasScrollingLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasScrollingLabel">
        Carrito
      </h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body carritoContainer">
      <div class="carrito"></div>
    </div>
  </div>`);

let carritoVacio = $(`
  <div class="carritoVacio">
    <h4>El carrito está vacío</h4>
  </div>  
  `);
let filaTotal = $(`
  <div class="total">
    <p>TOTAL</p>
    <p class="totalPrecio"></p>
    <button class="btn rounded-pill limpiarCarrito">Limpiar carrito</button>
  </div>`);
let carritoContador = $(`<span class="carritoContador"></span>`);
// función document ready
$(document).ready(function () {
  $(".main").append(loader); // loader para mientras se carga
  $(".main").append(grillaTienda); // cargo grilla tienda
  $(".tienda").append(barraBusqueda); // cargo la barra de busqueda
  $(".tienda").append(rowFiltrosProductos);
  $(".filtrosProductos").append(filtros); // cargo filtros
  $(".filtrosProductos").append(grillaProductos); // cargo grilla productos
  $(".tienda").append(carritoOffcanvas); // cargo off canvas
  $(".categoria").on("click", filtrar); // escucho las categorias
  $(".subcategoria").on("click", subFiltrar); // escucho los filtros
  $("#input").on("input", buscar); // escucho la barra de búsqueda
  emparejarCarritoStorage(); // emparejo carrito y Storage
  $(".limpiarCarrito").on("click", limpiarCarrito);
  // filtro productos destacados para renderizarlos al inicio
  let productosDestacados = productos.filter(
    (producto) => producto.destacado == "si"
  );
  renderizarProductos(productosDestacados);
  escucharBotonesAgregar();
  $(".loader").fadeOut(1000); // saco el loader con timing
  $(".tienda").delay(1001).fadeIn(1200); // cuando se va el loader, visibilizo la tienda
});
