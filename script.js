const coefficients = {
    C: { math: 6, pct: 5, svt: 2, francais: 2, anglais: 2, histgeo: 2, philo: 2, eps: 1 },
    D: { math: 4, pct: 4, svt: 5, francais: 2, anglais: 2, histgeo: 2, philo: 2, eps: 1 },
    A1: { math: 1, svt: 1, espagnol: 3, francais: 5, anglais: 3, histgeo: 4, philo: 3, eps: 1 },
    A2: { math: 1, svt: 1, espagnol: 3, francais: 4, anglais: 3, histgeo: 5, philo: 3, eps: 1 },
    B: { math: 1, francais: 3, eco: 4, histgeo: 4, philo: 3, eps: 1 },
    G2: { math: 1, svt: 2, francais: 2, anglais: 2, compta: 5, histgeo: 2, philo: 2, eps: 1 }
};

const faculties = [
    { name: "Faculté des Sciences et Techniques (FAST)", minScore: 14 },
    { name: "École Polytechnique d'Abomey-Calavi (EPAC)", minScore: 13 },
    { name: "Faculté des Sciences Économiques et de Gestion (FASEG)", minScore: 12 },
    { name: "Faculté des Lettres, Arts et Sciences Humaines (FLASH)", minScore: 11 },
    { name: "Institut National Médico-Sanitaire (INMeS)", minScore: 15 },
    { name: "École Normale Supérieure (ENS)", minScore: 13.5 }
];

function updateSubjects() {
    const serie = document.getElementById("serie").value;
    const subjectsContainer = document.getElementById("subjects-container");
    subjectsContainer.innerHTML = "";

    if (serie && coefficients[serie]) {
        Object.keys(coefficients[serie]).forEach(subject => {
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

function calculateOrientation() {
    const serie = document.getElementById("serie").value;
    if (!serie || !coefficients[serie]) {
        alert("Veuillez sélectionner une série et entrer vos notes.");
        return;
    }

    let totalWeightedGrade = 0;
    let totalCoefficients = 0;

    Object.entries(coefficients[serie]).forEach(([subject, coef]) => {
        const value = parseFloat(document.getElementById(subject)?.value) || 0;
        totalWeightedGrade += value * coef;
        totalCoefficients += coef;
    });

    const average = totalWeightedGrade / totalCoefficients;
    displayResults(average);
}

function displayResults(average) {
    const recommendedFaculties = faculties
        .filter(faculty => average >= faculty.minScore)
        .sort((a, b) => b.minScore - a.minScore)
        .slice(0, 3);

    let resultHTML = "<h3>Facultés recommandées :</h3>";
    recommendedFaculties.forEach((faculty, index) => {
        resultHTML += `<p>${index + 1}. ${faculty.name} - Moyenne requise : ${faculty.minScore}</p>`;
    });

    document.getElementById("result").innerHTML = resultHTML;
}
