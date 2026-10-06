function carregarTarget() {
  const input = document.getElementById("targetUrl");
  const iframe = document.getElementById("targetFrame");
  const status = document.getElementById("targetStatus");

  if (!input || !iframe) {
    return;
  }

  let url = input.value.trim();

  if (!url) {
    status.textContent = "Informe uma URL.";
    status.className = "error";
    return;
  }

  // Aceita somente HTTP/HTTPS
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Protocolo inválido");
    }

    url = parsedUrl.href;
  } catch (error) {
    status.textContent = "URL inválida. Use http:// ou https://";
    status.className = "error";
    return;
  }

  status.textContent = "Carregando...";
  status.className = "loading";

  iframe.src = url;

  document.getElementById("targetDisplay").textContent = url;
}

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

  if (link) {
    const linkX = largura * propX + (config.linkOffsetX || 0);
    const linkY = altura * propY + (config.linkOffsetY || 0);

    link.style.left = `${linkX}px`;
    link.style.top = `${linkY}px`;
  }
}

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

  posicionarLink();
});

window.addEventListener("resize", posicionarLink);
