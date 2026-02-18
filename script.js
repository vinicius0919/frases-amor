const fraseElement = document.getElementById("frase");

const STORAGE_KEY = "frases_usadas";
const RESET_KEY = "data_reset";
const ANOS_PARA_RESET = 2; // Pode alterar para 1 ou 2 anos

async function carregarFrases() {
  const response = await fetch("frases.json");
  const data = await response.json();
  return data.frases;
}

function precisaResetar() {
  const dataReset = localStorage.getItem(RESET_KEY);
  if (!dataReset) return true;

  const agora = new Date();
  const ultimoReset = new Date(dataReset);
  const diffAnos = (agora - ultimoReset) / (1000 * 60 * 60 * 24 * 365);

  return diffAnos >= ANOS_PARA_RESET;
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function mostrarFrase() {
  const frases = await carregarFrases();

  if (precisaResetar()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(RESET_KEY, new Date());
  }

  let usadas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const restantes = frases.filter((f) => !usadas.includes(f));

  if (restantes.length === 0) {
    // Reinicia automaticamente se acabar antes do prazo
    usadas = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    mostrarFrase();
    return;
  }

  const fraseEscolhida = embaralhar(restantes)[0];

  animarFrase(fraseEscolhida);

  usadas.push(fraseEscolhida);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usadas));
}

function animarFrase(texto) {
  fraseElement.style.opacity = 0;
  fraseElement.style.transform = "translateY(15px)";

  setTimeout(() => {
    fraseElement.textContent = texto;
    fraseElement.style.animation = "none";
    void fraseElement.offsetWidth; // reset animation
    fraseElement.style.animation = "fadeIn 1s forwards";
  }, 200);
}

mostrarFrase();
