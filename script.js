const coefficients = {
  C: {
    math: 6,
    pct: 5,
    svt: 2,
    francais: 2,
    anglais: 2,
    histgeo: 2,
    philo: 2,
    eps: 1,
  },
  D: {
    math: 4,
    pct: 4,
    svt: 5,
    francais: 2,
    anglais: 2,
    histgeo: 2,
    philo: 2,
    eps: 1,
  },
  A1: {
    math: 1,
    svt: 1,
    espagnol: 3,
    francais: 5,
    anglais: 3,
    histgeo: 4,
    philo: 3,
    eps: 1,
  },
  A2: {
    math: 1,
    svt: 1,
    espagnol: 3,
    francais: 4,
    anglais: 3,
    histgeo: 5,
    philo: 3,
    eps: 1,
  },
  B: { math: 1, francais: 3, eco: 4, histgeo: 4, philo: 3, eps: 1 },
  G2: {
    math: 1,
    svt: 2,
    francais: 2,
    anglais: 2,
    compta: 5,
    histgeo: 2,
    philo: 2,
    eps: 1,
  },
};

const faculties = [
  { name: "Faculté des Sciences et Techniques (FAST)", minScore: 14 },
  { name: "École Polytechnique d'Abomey-Calavi (EPAC)", minScore: 13 },
  {
    name: "Faculté des Sciences Économiques et de Gestion (FASEG)",
    minScore: 12,
  },
  {
    name: "Faculté des Lettres, Arts et Sciences Humaines (FLASH)",
    minScore: 11,
  },
  { name: "Institut National Médico-Sanitaire (INMeS)", minScore: 15 },
  { name: "École Normale Supérieure (ENS)", minScore: 13.5 },
];

function updateSubjects() {
  const serie = document.getElementById("serie").value;
  const subjectsContainer = document.getElementById("subjects-container");
  subjectsContainer.innerHTML = "";

  if (serie && coefficients[serie]) {
    Object.keys(coefficients[serie]).forEach((subject) => {
      const label = document.createElement("label");
      label.innerText = subject.charAt(0).toUpperCase() + subject.slice(1);

      const input = document.createElement("input");
      input.type = "number";
      input.id = subject;
      input.min = "0";
      input.max = "20";
      input.step = "0.25";
      input.placeholder = "Entrez votre note";

      subjectsContainer.appendChild(label);
      subjectsContainer.appendChild(input);
    });
  }
}

const fields = [
  {
    name: "commerce international",
    matieres: ["Maths", "Anglais", "Hist-Geo"],
    series: ["D", "C"],
  },
  {
    name: "Genie logiciel",
    matieres: ["Maths", "Anglais", "PCT"],
    series: ["B"],
  },
  {
    name: "Genie civil",
    matieres: ["Maths", "Pct", "Anglais"],
    series: ["C", "D"],
  },
];

function calculateFieldAverages(userSerie, notes) {
  // Récupérer les filières éligibles
  const eligibleFields = fields.filter((field) =>
    field.series.includes(userSerie)
  );

  // Calcul de la moyenne pour chaque filière
  const averages = eligibleFields.map((field) => {
    let sumNoteCoef = 0;
    let sumCoef = 0;

    // Pour chaque matière de la filière
    field.matieres.forEach((matiere) => {
      const matiereLower = matiere.toLowerCase();
      let note = 0;
      let coef = 0;

      // Convertir les noms des matières pour correspondre aux clés des notes
      switch (matiereLower) {
        case "maths":
          note = notes.math;
          coef = coefficients[userSerie].math;
          break;
        case "pct":
          note = notes.pct;
          coef = coefficients[userSerie].pct;
          break;
        case "anglais":
          note = notes.anglais;
          coef = coefficients[userSerie].anglais;
          break;
        case "hist-geo":
          note = notes.histgeo;
          coef = coefficients[userSerie].histgeo;
          break;
        case "svt":
          note = notes.svt;
          coef = coefficients[userSerie].svt;
          break;
      }

      sumNoteCoef += note * coef;
      sumCoef += coef;
    });

    const average = sumNoteCoef / sumCoef;

    return {
      filiere: field.name,
      moyenne: average.toFixed(2),
      matieres: field.matieres,
    };
  });

  return averages;
}

function calculateOrientation() {
  const serie = document.getElementById("serie").value;
  if (!serie || !coefficients[serie]) {
    alert("Veuillez sélectionner une série et entrer vos notes.");
    return;
  }

  const notes = {};
  Object.keys(coefficients[serie]).forEach((subject) => {
    const input = document.getElementById(subject);
    notes[subject] = parseFloat(input.value) || 0;
  });

  const averages = calculateFieldAverages(serie, notes);
  displayResults(averages);
}

/* function displayResults(average) {
  const recommendedFaculties = faculties
    .filter((faculty) => average >= faculty.minScore)
    .sort((a, b) => b.minScore - a.minScore)
    .slice(0, 3);

  let resultHTML = "<h3>Facultés recommandées :</h3>";
  recommendedFaculties.forEach((faculty, index) => {
    resultHTML += `<p>${index + 1}. ${faculty.name} - Moyenne requise : ${
      faculty.minScore
    }</p>`;
  });

  document.getElementById("result").innerHTML = resultHTML;
} */

function displayResults(averages) {
  const resultsContainer = document.getElementById("result");
  resultsContainer.innerHTML = "";

  if (averages.length === 0) {
    resultsContainer.innerHTML =
      "<p>Aucune filière éligible pour votre série.</p>";
    return;
  }

  // Trier les filières par moyenne décroissante
  averages.sort((a, b) => parseFloat(b.moyenne) - parseFloat(a.moyenne)).slice(0, 2);
  
  const resultsList = document.createElement("div");
  resultsList.className = "results-list";

  averages.forEach((result) => {
    const filiereDiv = document.createElement("div");
    filiereDiv.className = "filiere-result";

    filiereDiv.innerHTML = `
        <h3>${result.filiere}</h3>
        <p>Moyenne : ${result.moyenne}</p>
        <p>Matières prises en compte : ${result.matieres.join(", ")}</p>
      `;

    resultsList.appendChild(filiereDiv);
  });

  resultsContainer.appendChild(resultsList);
}

const form = document.getElementById("orientation-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateOrientation();
  });
}
