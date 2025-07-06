
fetch("data_Bioquimica2023.json")
  .then(res => res.json())
  .then(data => {
    const malla = document.getElementById("malla");
    data.materias.forEach(materia => {
      const btn = document.createElement("button");
      btn.innerText = materia.nombre;
      btn.style.background = getColor(materia.tipo);
      btn.onclick = () => btn.classList.toggle("tachado");
      malla.appendChild(btn);
    });
  });

function getColor(tipo) {
  const colores = {
    "introductoria": "#AEDFF7",
    "media": "#FFC57E",
    "avanzada": "#FF7E7E",
    "flexible": "#D4C3FF",
    "taller": "#B3F7C2",
    "integrador": "#F7E287"
  };
  return colores[tipo] || "#CCCCCC";
}
