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
          Object.keys(grupos).sort((a,b) => parseInt(a)-parseInt(b)).forEach(key => {
            const col = document.createElement("div");
            col.className = "cuatrimestre";
            col.innerHTML = "<h2>" + (key>0 ? key + "º Cuatrimestre" : "Materias especiales") + "</h2>";
            grupos[key].forEach(m => {
              const btn = document.createElement("div");
              btn.className = "materia";
              btn.innerText = m.nombre;

              // Asignar color según tipo
              if (m.tipo && colores[m.tipo]) {
                btn.style.backgroundColor = colores[m.tipo];
              }

              const habilitada = m.correlativas_pc.every(id => {
                const req = data.materias.find(x => x.id === id);
                return req && req.aprobada;
              });

              if (habilitada) btn.classList.add("habilitada");
              else btn.classList.add("inhabilitada");  // para que puedas aplicar estilo clarito

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
          });
        }

        render();
      });
  });
