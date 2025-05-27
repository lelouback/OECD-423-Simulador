// Base de dados com 50 substâncias (DL50 em mg/kg)
const substances = [
    // Fármacos (12)
    { name: "Paracetamol", dl50: 1944, category: "drug" },
    { name: "Ibuprofeno", dl50: 636, category: "drug" },
    // ... (mantenha o restante das substâncias como no código anterior)
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
    // ... (mantenha a mesma função de inicialização)
}

// Configurar eventos
function setupEventListeners() {
    // ... (mantenha os mesmos listeners)
}

// Função sigmoide para cálculo da probabilidade
function calculateDeathProbability(dl50, dose) {
    if (dose === 0) return 0; // Dose zero sempre retorna 0% de probabilidade
    return 1 / (1 + Math.exp(-(dose - dl50)/(0.2 * dl50)));
}

// Determinar resultado conforme OECD 423 com aleatoriedade
function determineResult(probability) {
    if (probability > 0.7) {
        return { status: "MORTO", class: "dead", probability: probability };
    } else if (probability < 0.3) {
        return { status: "VIVO", class: "alive", probability: probability };
    } else {
        // Faixa de incerteza (30-70%): resultado aleatório baseado na probabilidade
        const random = Math.random(); // Número aleatório entre 0 e 1
        if (random < probability) {
            return { status: "MORTO", class: "dead", probability: probability };
        } else {
            return { status: "VIVO", class: "alive", probability: probability };
        }
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

// Exibir resultado com probabilidade
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
                <th>Probabilidade de letalidade</th>
                <td>${(result.probability * 100).toFixed(1)}%</td>
            </tr>
            <tr>
                <th>Resultado</th>
                <td><strong>${result.status}</strong></td>
            </tr>
        </table>
        ${result.probability >= 0.3 && result.probability <= 0.7 ? 
            '<p class="random-note">Resultado determinado aleatoriamente com base na probabilidade calculada</p>' : ''}
    `;
}

// Inicializar o aplicativo
function init() {
    initializeSubstanceOptions();
    setupEventListeners();
}

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);