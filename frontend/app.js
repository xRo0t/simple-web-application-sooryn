const output = document.querySelector("#output");
const pingButton = document.querySelector("#ping");
const infoButton = document.querySelector("#refresh-info");
const backendName = document.querySelector("#backend-name");
const backendMode = document.querySelector("#backend-mode");
const bridgeMode = document.querySelector("#bridge-mode");
const bridgeStatus = document.querySelector("#bridge-status");
const statusDot = document.querySelector(".status-dot");
const lastRun = document.querySelector("#last-run");
const responseChip = document.querySelector("#response-chip");

function installMockBridge() {
  if (window.dolet && typeof window.dolet.invoke === "function") {
    return;
  }
  window.dolet = {
    __nativeBridge: false,
    invoke(name, payload) {
      return Promise.resolve({
        ok: true,
        mock: true,
        name,
        payload,
        message: "CEF bridge not connected"
      });
    }
  };
}

async function ensureBridge() {
  for (let i = 0; i < 30; i += 1) {
    if (window.dolet && typeof window.dolet.invoke === "function") {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  installMockBridge();
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function setOnline(label) {
  bridgeStatus.textContent = label;
  statusDot.classList.add("online");
  bridgeMode.textContent = window.dolet && window.dolet.__nativeBridge ? "CEF" : "Mock";
}

function showResponse(label, value) {
  responseChip.textContent = label;
  responseChip.classList.remove("neutral");
  output.textContent = pretty(value);
  lastRun.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

async function refreshInfo() {
  await ensureBridge();
  const response = await window.dolet.invoke("app.info", { source: "ui" });
  backendName.textContent = response.name || "Dolet";
  backendMode.textContent = response.mock ? "mock bridge" : "native bridge";
  setOnline(response.mock ? "Mock bridge" : "CEF bridge");
  showResponse("Info", response);
}

async function runCheck() {
  await ensureBridge();
  pingButton.disabled = true;
  pingButton.textContent = "Running";
  try {
    const response = await window.dolet.invoke("ping", {
      source: "ui",
      job: "compile-backend"
    });
    showResponse("OK", response);
  } catch (error) {
    responseChip.textContent = "Error";
    output.textContent = pretty({ ok: false, error: String(error) });
  } finally {
    pingButton.disabled = false;
    pingButton.textContent = "Run Check";
  }
}

infoButton.addEventListener("click", refreshInfo);
pingButton.addEventListener("click", runCheck);

refreshInfo();
