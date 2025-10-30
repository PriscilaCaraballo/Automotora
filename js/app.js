// Mi código JavaScript:
const selectAnio = document.querySelector(".seleccion-anio");
const selectMarca = document.querySelector(".seleccion-marca");
const selectModelo = document.querySelector(".seleccion-modelo");
const buttonFiltrar = document.querySelector(".btn-filtrar");

for (let i = 2025; i > 1900; i--) {
  selectAnio.insertAdjacentHTML(
    "beforeend",
    "<option value='" + i + "' >" + i + "</option>"
  );
}

// https://ha-front-api-proyecto-final.vercel.app/brands
fetch("https://ha-front-api-proyecto-final.vercel.app/brands")
  .then(function (infoJson) {
    return infoJson.json();
  })
  .then(function (marcas) {
    for (const marca of marcas) {
      selectMarca.insertAdjacentHTML(
        "beforeend",
        "<option value='" + marca + "' >" + marca + "</option>"
      );
    }
  })
  .catch(function (Error) {
    console.log("Error:" + Error);
  });

selectMarca.addEventListener("change", () => {
  // https://ha-front-api-proyecto-final.vercel.app/models?brand=Audi
  fetch(
    "https://ha-front-api-proyecto-final.vercel.app/models?brand=" +
      selectMarca.value
  )
    .then(function (infoJson) {
      return infoJson.json();
    })
    .then(function (modelos) {
      selectModelo.innerHTML = "<option disabled>Seleccionar...</option>";
      for (const modelo of modelos) {
        selectModelo.insertAdjacentHTML(
          "beforeend",
          "<option value='" + modelo + "' >" + modelo + "</option>"
        );
      }
    })
    .catch(function (Error) {
      console.log("Error:" + Error);
    });
});

const contenedorCard = document.querySelector(".container-card-auto");

buttonFiltrar.addEventListener("click", () => {
  fetch(
    "https://ha-front-api-proyecto-final.vercel.app/cars?year=" +
      selectAnio.value +
      "&brand=" +
      selectMarca.value +
      "&model=" +
      selectModelo.value
  )
    .then(function (infoJson) {
      return infoJson.json();
    })
    .then(function (arrayAutos) {
      if (arrayAutos.length == 0) {
        contenedorCard.innerHTML = "";
        contenedorCard.insertAdjacentHTML(
          "afterbegin",
          `<div class="alert alert-danger" role="alert">
          Lamentablemente ninguno de nuestros auto cumple con esas
          especificaciones
        </div>`
        );
      } else {
        cargarAutos(arrayAutos);
      }
    })
    .catch(function (Error) {
      console.log("Error:" + Error);
    });
});

function cargarAutos(arrayAutos) {
  contenedorCard.innerHTML = "";
  for (const auto of arrayAutos) {
    // <span class="badge rounded-pill text-bg-warning">Nuevo</span>
    let nuevo = "";
    if (auto.status === 1) {
      nuevo = '<span class="badge rounded-pill">Nuevo</span>';
    }

    let starAdd = "";
    let star = 5;
    let solid = auto.rating;
    let regular = star - solid;
    for (let i = 0; i < solid; i++) {
      starAdd += '<i class="fa-solid fa-star text-warning"></i>';
    }
    for (let i = 0; i < regular; i++) {
      starAdd += '<i class="fa-regular fa-star text-warning"></i>';
    }

    let precio = String(auto.price_usd);
    let precioAdd = "";
    let cont = 0;
    for (let i = precio.length - 1; i >= 0; i--) {
      cont++;
      precioAdd = precio[i] + precioAdd; //i = 0, precio = 9, predioAdd = "" ->""9
      if (cont % 3 == 0 && i != 0) {
        precioAdd = "." + precioAdd;
      }
    }
    contenedorCard.insertAdjacentHTML(
      "beforeend",
      `<div class="card mb-3 g-0">
            <div class="row">
              <div
                class="col-12 col-md-4 img-card-container"
                style="overflow: hidden"
              >
                <div class="img-badge">
                  <img
                    src="${auto.image}"
                    alt=""
                    class="img-fluid img-card"
                  />
                  ${nuevo}
                </div>
              </div>
              <div class="col-12 col-md-8 card-body">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <h3 class="card-title title-img">${auto.brand} ${auto.model}</h3>
                  </div>
                  <div class="col-12 col-md-6 text-end">
                    <p class="card-text data-card">${auto.year} | USD ${precioAdd} | ${starAdd}</p>
                  </div>
                </div>

                <p class="card-text">
                  ${auto.description}
                </p>
                <!-- icono de carrito -->
                <button type="button" class="btn btn-success">Comprar</button>
                <!-- icono de mas -->
                <button type="button" class="btn btn-light">
                  Mas informacion
                </button>
                <!-- icono de compartir  -->
                <button type="button" class="btn btn-light">Compartir</button>
              </div>
            </div>
          </div>`
    );
  }
}

// https://ha-front-api-proyecto-final.vercel.app/cars
/* <i class="fa-regular fa-star text-warning"></i> */
fetch("https://ha-front-api-proyecto-final.vercel.app/cars")
  .then(function (infoJson) {
    return infoJson.json();
  })
  .then(function (arrayAutos) {
    cargarAutos(arrayAutos);
  });
