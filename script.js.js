// Base de dados com 50 substâncias (DL50 em mg/kg)
const substances = [
    // Fármacos (12)
    { name: "Paracetamol", dl50: 1944, category: "drug" },
    { name: "Ibuprofeno", dl50: 636, category: "drug" },
    { name: "Diazepam", dl50: 720, category: "drug" },
    { name: "Morfina", dl50: 335, category: "drug" },
    { name: "Cloroquina", dl50: 330, category: "drug" },
    { name: "Amoxicilina", dl50: 3000, category: "drug" },
    { name: "Omeprazol", dl50: 2180, category: "drug" },
    { name: "Metformina", dl50: 1000, category: "drug" },
    { name: "AAS (Aspirina)", dl50: 200, category: "drug" },
    { name: "Losartana", dl50: 1000, category: "drug" },
    { name: "Propranolol", dl50: 500, category: "drug" },
    { name: "Sertralina", dl50: 1600, category: "drug" },
    { name: "Warfarina", dl50: 323, category: "drug" },
    
    // Pesticidas (10)
    { name: "DDT", dl50: 113, category: "pesticide" },
    { name: "Glifosato", dl50: 5600, category: "pesticide" },
    { name: "Malation", dl50: 2100, category: "pesticide" },
    { name: "Carbaril", dl50: 250, category: "pesticide" },
    { name: "Paraquat", dl50: 150, category: "pesticide" },
    { name: "Aldicarbe", dl50: 0.93, category: "pesticide" },
    { name: "Clorpirifós", dl50: 135, category: "pesticide" },
    { name: "Atrazina", dl50: 672, category: "pesticide" },
    { name: "Diazinon", dl50: 300, category: "pesticide" },
    { name: "Permetrina", dl50: 1500, category: "pesticide" },
    
    // Drogas de Abuso (10)
    { name: "Cocaína", dl50: 17.5, category: "abuse" },
    { name: "Heroína", dl50: 22, category: "abuse" },
    { name: "Metanfetamina", dl50: 55, category: "abuse" },
    { name: "MDMA (Ecstasy)", dl50: 97, category: "abuse" },
    { name: "LSD", dl50: 0.3, category: "abuse" },
    { name: "THC (Maconha)", dl50: 1270, category: "abuse" },
    { name: "Fentanil", dl50: 0.03, category: "abuse" },
    { name: "Metadona", dl50: 95, category: "abuse" },
    { name: "Nicotina", dl50: 50, category: "abuse" },
    { name: "Cafeína", dl50: 192, category: "abuse" },
    
    // Toxinas e Químicos (18)
    { name: "Cianeto de Sódio", dl50: 6.4, category: "toxin" },
    { name: "Arsênico", dl50: 15, category: "toxin" },
    { name: "Mercúrio", dl50: 1, category: "toxin" },
    { name: "Chumbo", dl50: 450, category: "toxin" },
    { name: "Tálio", dl50: 25, category: "toxin" },
    { name: "Estricnina", dl50: 16, category: "toxin" },
    { name: "Rícino", dl50: 0.02, category: "toxin" },
    { name: "Tetracloreto de Carbono", dl50: 2350, category: "toxin" },
    { name: "Fluoreto de Sódio", dl50: 52, category: "toxin" },
    { name: "Aflatoxina B1", dl50: 0.5, category: "toxin" },
    { name: "Etanol", dl50: 7060, category: "chemical" },
    { name: "Metanol", dl50: 5628, category: "chemical" },
    { name: "Formaldeído", dl50: 100, category: "chemical" },
    { name: "Benzeno", dl50: 930, category: "chemical" },
    { name: "Amoníaco", dl50: 350, category: "chemical" },
    { name: "Cloro", dl50: 293, category: "chemical" },
    { name: "Cádmio", dl50: 225, category: "chemical" }
];

// Elementos do DOM
const substanceSelect = document.getElementById('substance');
const doseSelect = document.getElementById('dose');
const customDoseInput = document.getElementById('custom-dose');
const simulateBtn = document.getElementById('simulate-btn');
const resultElement = document.getElementById('result');
const resultContent = document.getElementById('result-content');

// Inicialização - Preencher opções de substâncias
function initializeSubstanceOptions() {
    const groups = {
        drug: "Fármacos",
        pesticide: "Pesticidas",
        abuse: "Drogas de Abuso",
        toxin: "Toxinas",
        chemical: "Químicos"
    };
    
    // Agrupar substâncias por categoria
    const grouped = {};
    substances.forEach((sub, index) => {
        if (!grouped[sub.category]) {
            grouped[sub.category] = [];
        }
        grouped[sub.category].push({...sub, index});
    });
    
    // Adicionar ao select
    for (const [category, subs] of Object.entries(grouped)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = groups[category];
        
        subs.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.index;
            option.textContent = sub.name;
            option.dataset.category = sub.category;
            optgroup.appendChild(option);
        });
        
        substanceSelect.appendChild(optgroup);
    }
}

// Configurar eventos
function setupEventListeners() {
    // Mostrar/ocultar campo de dose customizada
    doseSelect.addEventListener('change', function() {
        customDoseInput.style.display = this.value === "custom" ? "block" : "none";
        if (this.value !== "custom") {
            customDoseInput.value = "";
        }
    });

    // Executar simulação
    simulateBtn.addEventListener('click', runSimulation);
}

// Função sigmoide para cálculo da probabilidade
function calculateDeathProbability(dl50, dose) {
    if (dose === 0) return 0; // Dose zero sempre retorna 0% de probabilidade
    return 1 / (1 + Math.exp(-(dose - dl50)/(0.2 * dl50)));
}

// Determinar resultado conforme OECD 423
function determineResult(probability) {
    if (probability > 0.7) {
        return { status: "MORTO", class: "dead" };
    } else if (probability < 0.5) {
        return { status: "VIVO", class: "alive" };
    } else {
        return { status: "SINAIS DE INTOXICAÇÃO", class: "intoxicated" };
    }
}

// Executar simulação
function runSimulation() {
    const selectedIndex = substanceSelect.value;
    const doseOption = doseSelect.value;
    
    if (selectedIndex === "") {
        alert('Por favor, selecione uma substância.');
        return;
    }
    
    let dose;
    if (doseOption === "custom") {
        dose = parseFloat(customDoseInput.value);
        if (isNaN(dose)) {
            alert('Por favor, insira uma dose válida.');
            return;
        }
    } else if (doseOption === "") {
        alert('Por favor, selecione uma dose.');
        return;
    } else {
        dose = parseFloat(doseOption);
    }
    
    const substance = substances[selectedIndex];
    const prob = calculateDeathProbability(substance.dl50, dose);
    const result = determineResult(prob);
    
    displayResult(substance, dose, result);
    
    // Resetar o campo de dose após a simulação
    doseSelect.value = "";
    customDoseInput.value = "";
    customDoseInput.style.display = "none";
}

// Exibir resultado
function displayResult(substance, dose, result) {
    const categoryClass = substance.category;
    const categoryNames = {
        "drug": "Fármaco",
        "pesticide": "Pesticida",
        "abuse": "Droga de Abuso",
        "toxin": "Toxina",
        "chemical": "Químico"
    };
    
    resultElement.className = `result ${result.class}`;
    resultElement.style.display = 'block';
    
    resultContent.innerHTML = `
        <table>
            <tr>
                <th>Substância</th>
                <td>${substance.name} <span class="category-tag ${categoryClass}">${categoryNames[substance.category]}</span></td>
            </tr>
            <tr>
                <th>Dose administrada</th>
                <td>${dose} mg/kg</td>
            </tr>
            <tr>
                <th>Resultado</th>
                <td><strong>${result.status}</strong></td>
            </tr>
        </table>
    `;
}

// Inicializar o aplicativo
function init() {
    initializeSubstanceOptions();
    setupEventListeners();
}

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);