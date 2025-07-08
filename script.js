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

          // Definir los ciclos según cuatrimestres
          const cicloComun = [3, 4, 5, 6];
          const cicloSuperior = [7, 8, 9, 10, 11];

          // Ordenar cuatrimestres existentes
          const cuatrimestres = Object.keys(grupos)
            .map(Number)
            .sort((a,b) => a-b);

          // Agrupar en pares para apilar (3 con 4, 5 con 6, etc)
          let paresCuatrimestres = [];
          for (let i = 0; i < cuatrimestres.length; i += 2) {
            paresCuatrimestres.push([cuatrimestres[i], cuatrimestres[i+1]]);
          }

          // Función para crear columna apilada con dos cuatrimestres
          function crearColumna(cuatriPar) {
            const col = document.createElement("div");
            col.className = "columna-pareada";

            cuatriPar.forEach(cuatri => {
              if (!cuatri) return; // puede faltar el segundo cuatri en par impar
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

          // Crear contenedores para Ciclo Común y Ciclo Superior
          const contenedorComun = document.createElement("div");
          contenedorComun.className = "contenedor-ciclo";
          const tituloComun = document.createElement("h1");
          tituloComun.innerText = "Ciclo Común";
          contenedorComun.appendChild(tituloComun);

          const contenedorSuperior = document.createElement("div");
          contenedorSuperior.className = "contenedor-ciclo";
          const tituloSuperior = document.createElement("h1");
          tituloSuperior.innerText = "Ciclo Superior";
          contenedorSuperior.appendChild(tituloSuperior);

          // Distribuir pares de cuatrimestres en los ciclos correspondientes
          paresCuatrimestres.forEach(par => {
            const primerCuatri = par[0];
            if (cicloComun.includes(primerCuatri)) {
              contenedorComun.appendChild(crearColumna(par));
            } else if (cicloSuperior.includes(primerCuatri)) {
              contenedorSuperior.appendChild(crearColumna(par));
            } else {
              // Por si hay cuatrimestres fuera de esos ciclos (ej. especiales)
              malla.appendChild(crearColumna(par));
            }
          });

          // Solo agregar al DOM si hay materias
          if (contenedorComun.children.length > 1) malla.appendChild(contenedorComun);
          if (contenedorSuperior.children.length > 1) malla.appendChild(contenedorSuperior);
        }

        render();
      });
  });
