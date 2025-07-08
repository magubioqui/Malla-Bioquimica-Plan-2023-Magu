let colores = {};

fetch("colors_Bioquimica2023.json")
  .then(res => res.json())
  .then(dataColores => {
    colores = dataColores;

    fetch("data_Bioquimica2023_COMPLETO.json")
      .then(response => response.json())
      .then(data => {
        const saved = JSON.parse(localStorage.getItem("bioquimica2023")) || {};
        data.materias.forEach(m => m.aprobada = saved[m.id] || false);

        const malla = document.getElementById("malla");
        const grupos = {};
        data.materias.forEach(m => {
          const key = m.cuatrimestre;
          if (!grupos[key]) grupos[key] = [];
          grupos[key].push(m);
        });

       function render() {
  malla.innerHTML = "";

  const cicloComun = [[3, 4], [5, 6]];
  const cicloSuperior = [[7, 8], [9, 10], [11]];

  const materiasEspeciales = grupos[0] || grupos["0"] || [];

  function crearColumna(cuatris) {
    const col = document.createElement("div");
    col.className = "columna-pareada";

    cuatris.forEach(cuatri => {
      if (!grupos[cuatri]) return;

      const contenedorCuatri = document.createElement("div");
      contenedorCuatri.className = "cuatrimestre-apilado";
      contenedorCuatri.innerHTML = `<h2>${cuatri}º Cuatrimestre</h2>`;

      grupos[cuatri].forEach(m => {
        const btn = document.createElement("div");
        btn.className = "materia";
        btn.innerText = m.nombre;

        if (m.tipo && colores[m.tipo]) {
          btn.style.backgroundColor = colores[m.tipo];
        }

        const habilitada = m.correlativas_pc.every(id => {
          const req = data.materias.find(x => x.id === id);
          return req && req.aprobada;
        });

        if (habilitada) btn.classList.add("habilitada");
        else btn.classList.add("inhabilitada");

        if (m.aprobada) btn.classList.add("tachado");

        btn.onclick = () => {
          if (!btn.classList.contains("habilitada")) return;
          m.aprobada = !m.aprobada;
          localStorage.setItem("bioquimica2023", JSON.stringify(
            Object.fromEntries(data.materias.map(x => [x.id, x.aprobada]))
          ));
          render();
        };

        contenedorCuatri.appendChild(btn);
      });

      col.appendChild(contenedorCuatri);
    });

    return col;
  }

  function crearBloqueCiclo(nombre, pares) {
    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-ciclo";

    const titulo = document.createElement("h1");
    titulo.innerText = nombre;
    contenedor.appendChild(titulo);

    pares.forEach(par => {
      contenedor.appendChild(crearColumna(par));
    });

    return contenedor;
  }

  // Primero: materias especiales (cuatrimestre 0)
  if (materiasEspeciales.length > 0) {
    const col = document.createElement("div");
    col.className = "cuatrimestre";
    col.innerHTML = "<h2>Materias obligatorias sin cuatrimestre fijo</h2>";

    materiasEspeciales.forEach(m => {
      const btn = document.createElement("div");
      btn.className = "materia";
      btn.innerText = m.nombre;

      if (m.tipo && colores[m.tipo]) {
        btn.style.backgroundColor = colores[m.tipo];
      }

      const habilitada = m.correlativas_pc.every(id => {
        const req = data.materias.find(x => x.id === id);
        return req && req.aprobada;
      });

      if (habilitada) btn.classList.add("habilitada");
      else btn.classList.add("inhabilitada");

      if (m.aprobada) btn.classList.add("tachado");

      btn.onclick = () => {
        if (!btn.classList.contains("habilitada")) return;
        m.aprobada = !m.aprobada;
        localStorage.setItem("bioquimica2023", JSON.stringify(
          Object.fromEntries(data.materias.map(x => [x.id, x.aprobada]))
        ));
        render();
      };

      col.appendChild(btn);
    });

    malla.appendChild(col);
  }

  // Luego: ciclos comunes y superiores
  malla.appendChild(crearBloqueCiclo("Ciclo Común", cicloComun));
  malla.appendChild(crearBloqueCiclo("Ciclo Superior", cicloSuperior));
}

        render();
      })
      .catch(error => {
        console.error("Error al cargar data_Bioquimica2023_COMPLETO.json:", error);
      });
  })
  .catch(error => {
    console.error("Error al cargar colors_Bioquimica2023.json:", error);
  });
