
fetch('data_Bioquimica2023.json')
  .then(res => res.json())
  .then(data => {
    const materias = data.materias;
    const mallaDiv = document.getElementById('malla');

    const columnas = {};
    materias.forEach(mat => {
      if (!columnas[mat.cuatrimestre]) columnas[mat.cuatrimestre] = [];
      columnas[mat.cuatrimestre].push(mat);
    });

    const aprobadas = new Set();
    const render = () => {
      mallaDiv.innerHTML = '';
      Object.keys(columnas).sort((a, b) => a - b).forEach(cuatri => {
        const col = document.createElement('div');
        col.className = 'column';
        columnas[cuatri].forEach(mat => {
          const div = document.createElement('div');
          div.className = 'materia';
          div.textContent = mat.nombre;
          const puedeCursar = mat.correlativas_pc.every(id => aprobadas.has(id));
          if (aprobadas.has(mat.id)) {
            div.classList.add('tachada');
          } else if (puedeCursar) {
            div.classList.add('habilitada');
            div.onclick = () => {
              aprobadas.add(mat.id);
              render();
            };
          } else {
            div.classList.add('bloqueada');
          }
          col.appendChild(div);
        });
        mallaDiv.appendChild(col);
      });
    };
    render();
  });
