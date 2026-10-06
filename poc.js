let imageVisible = false;
let dragMode = false;
let dragging = false;

let dragOffsetX = 0;
let dragOffsetY = 0;

function carregarTarget() {
  const input = document.getElementById("targetUrl");
  const iframe = document.getElementById("targetFrame");
  const status = document.getElementById("targetStatus");
  const loadingBar = document.getElementById("loadingBar");
  const targetDisplay = document.getElementById("targetDisplay");

  if (!input || !iframe || !status) {
    return;
  }

  let url = input.value.trim();

  if (!url) {
    status.textContent = "Informe uma URL.";
    status.className = "error";

    if (loadingBar) {
      loadingBar.style.width = "0%";
    }

    return;
  }

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      throw new Error("Protocolo inválido");
    }

    url = parsedUrl.href;

  } catch (error) {
    status.textContent = "URL inválida. Use http:// ou https://";
    status.className = "error";

    if (loadingBar) {
      loadingBar.style.width = "0%";
    }

    return;
  }

  status.textContent = "Carregando alvo...";
  status.className = "loading";

  if (loadingBar) {
    loadingBar.style.width = "0%";

    setTimeout(() => {
      loadingBar.style.width = "30%";
    }, 50);

    setTimeout(() => {
      loadingBar.style.width = "65%";
    }, 300);
  }

  if (targetDisplay) {
    targetDisplay.textContent = url;
  }

  iframe.onload = function () {
    if (loadingBar) {
      loadingBar.style.width = "100%";
    }

    status.textContent = "✓ Navegação concluída";
    status.className = "loaded";
  };

  iframe.src = url;
}


/* =========================================================
   IMAGEM
   ========================================================= */

function alternarImagem() {
  const imagem = document.getElementById("pocImage");
  const botao = document.getElementById("toggleImage");

  if (!imagem || !botao) {
    return;
  }

  imageVisible = !imageVisible;

  imagem.style.display = imageVisible ? "block" : "none";

  botao.textContent = imageVisible
    ? "Ocultar imagem"
    : "Mostrar imagem";
}


/* =========================================================
   POSICIONAMENTO
   ========================================================= */

function posicionarLink() {
  const largura = window.innerWidth;
  const altura = window.innerHeight;

  const config = window.POC_CONFIG || {};

  const baseWidth = config.baseWidth || 1920;
  const baseHeight = config.baseHeight || 1080;

  const targetX = config.targetX || 0;
  const targetY = config.targetY || 0;

  const propX = targetX / baseWidth;
  const propY = targetY / baseHeight;

  const link = document.getElementById("redirectLink");

  if (!link) {
    return;
  }

  const linkX =
    largura * propX + (config.linkOffsetX || 0);

  const linkY =
    altura * propY + (config.linkOffsetY || 0);

  link.style.left = `${linkX}px`;
  link.style.top = `${linkY}px`;
}


/* =========================================================
   MODO ARRASTAR
   ========================================================= */

function ativarModoArrastar() {
  const link = document.getElementById("redirectLink");
  const botao = document.getElementById("toggleDrag");

  if (!link || !botao) {
    return;
  }

  dragMode = !dragMode;

  if (dragMode) {
    botao.textContent = "✓ Posicionando";
    botao.classList.add("active");

    link.classList.add("draggable");
    document.body.classList.add("drag-mode");

  } else {
    botao.textContent = "Posicionar botão";
    botao.classList.remove("active");

    link.classList.remove("draggable");
    document.body.classList.remove("drag-mode");
  }
}


/* =========================================================
   DRAG COM MOUSE
   ========================================================= */

function iniciarDrag(event) {

  if (!dragMode) {
    return;
  }

  const link = document.getElementById("redirectLink");

  if (!link) {
    return;
  }

  dragging = true;

  const rect = link.getBoundingClientRect();

  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;

  link.classList.add("dragging");

  event.preventDefault();
}


function moverDrag(event) {

  if (!dragging) {
    return;
  }

  const link = document.getElementById("redirectLink");

  if (!link) {
    return;
  }

  let x = event.clientX - dragOffsetX;
  let y = event.clientY - dragOffsetY;

  /*
   * Mantém o botão dentro da tela
   */
  const maxX = window.innerWidth - link.offsetWidth;
  const maxY = window.innerHeight - link.offsetHeight;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  link.style.left = `${x}px`;
  link.style.top = `${y}px`;

  atualizarCoordenadas();
}


function finalizarDrag() {

  if (!dragging) {
    return;
  }

  const link = document.getElementById("redirectLink");

  dragging = false;

  if (link) {
    link.classList.remove("dragging");
  }

  atualizarCoordenadas();
}


function bloquearCliqueDuranteDrag(event) {

  if (dragMode) {
    event.preventDefault();
  }
}


/* =========================================================
   MOSTRAR COORDENADAS
   ========================================================= */

function atualizarCoordenadas() {

  const link = document.getElementById("redirectLink");
  const coordinateDisplay =
    document.getElementById("coordinates");

  if (!link || !coordinateDisplay) {
    return;
  }

  const rect = link.getBoundingClientRect();

  coordinateDisplay.textContent =
    `X: ${Math.round(rect.left)} | Y: ${Math.round(rect.top)}`;
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

window.addEventListener("load", function () {

  const button = document.getElementById("loadTarget");

  if (button) {
    button.addEventListener("click", carregarTarget);
  }


  const input = document.getElementById("targetUrl");

  if (input) {
    input.addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        carregarTarget();
      }

    });
  }


  const toggleImage =
    document.getElementById("toggleImage");

  if (toggleImage) {
    toggleImage.addEventListener(
      "click",
      alternarImagem
    );
  }


  const toggleDrag =
    document.getElementById("toggleDrag");

  if (toggleDrag) {
    toggleDrag.addEventListener(
      "click",
      ativarModoArrastar
    );
  }


  const link =
    document.getElementById("redirectLink");

  if (link) {

    link.addEventListener(
      "mousedown",
      iniciarDrag
    );

    link.addEventListener(
      "click",
      bloquearCliqueDuranteDrag
    );

  }


  document.addEventListener(
    "mousemove",
    moverDrag
  );

  document.addEventListener(
    "mouseup",
    finalizarDrag
  );


  posicionarLink();
  atualizarCoordenadas();

});


window.addEventListener(
  "resize",
  function () {

    /*
     * Só recalcula automaticamente se
     * não estiver no modo de posicionamento.
     */
    if (!dragMode) {
      posicionarLink();
    }

    atualizarCoordenadas();
  }
);
