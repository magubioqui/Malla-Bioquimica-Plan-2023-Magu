let colores = {};

fetch("colors_Bioquimica2023.json")
  .then(res => res.json())
  .then(dataColores => {
    colores = dataColores;

    fetch("data_Bioquimica2023_COMPLETO.json")
      .then(response => response.json())
      .then(data => {
        // Cargar progreso guardado de materias
        const saved = JSON.parse(localStorage.getItem("bioquimica2023")) || {};
        data.materias.forEach(m => {
          m.aprobada = saved.hasOwnProperty(m.id) ? saved[m.id] : false;
        });

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

if (m.id === 300) {
  console.log("Verificando habilitación de Laboratorio Integrador (300)");
  console.log("Estado de correlativas (7 a 18):");
  m.correlativas_pc.forEach(id => {
    const mat = data.materias.find(x => x.id === id);
    console.log(`Materia ${id} - ${mat.nombre}: aprobada = ${mat.aprobada}`);
  });
}

const habilitada = m.correlativas_pc.every(id => {
  const correlativa = data.materias.find(mat => mat.id === id);
  if (!correlativa) {
    console.warn(`⚠️ Correlativa con id ${id} no encontrada para ${m.nombre}`);
    return false;
  }
  return correlativa.aprobada === true;
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

          // Materias especiales sin cuatrimestre fijo
          if (materiasEspeciales.length > 0) {
            const col = document.createElement("div");
            col.className = "cuatrimestre";
            col.innerHTML = "<h2>Cursadas obligatorias sin cuatrimestre fijo</h2>";

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

          // Ciclo Común y Superior
          malla.appendChild(crearBloqueCiclo("Ciclo Común", cicloComun));
          malla.appendChild(crearBloqueCiclo("Ciclo Superior", cicloSuperior));

          // Notas (una sola vez)
          const notasContainer = document.getElementById("notas");
          if (!notasContainer.querySelector(".contenedor-notas")) {
            const contenedorNotas = document.createElement("div");
            contenedorNotas.className = "contenedor-notas";

            const notas = [
              "Los cuatrimestres 5, 7, 9 y 11 se dictan en el primer cuatrimestre del año.",
              "Los cuatrimestres 4, 6, 8 y 10 se dictan en el segundo cuatrimestre del año.",
              "** Materias bimestrales.",
              "Los TALLERES DE INTRODUCCIÓN al ROL PROFESIONAL y CIENTÍFICO se realizan entre el 3er y 6to cuatrimestre.",
              "- LABORATORIO INTEGRADOR: Consta de 20 horas totales distribuidas en 5 días consecutivos. Para realizar esta actividad se requiere haber aprobado los TPS de las materias 7 a 18. Es requisito realizar esta actividad antes de comenzar a cursar cualquier asignatura del 9no cuatrimestre."
            ];

            notas.forEach(texto => {
              const p = document.createElement("p");
              p.className = "aclaracion";
              p.innerText = texto;
              contenedorNotas.appendChild(p);
            });

            notasContainer.appendChild(contenedorNotas);
          }
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
