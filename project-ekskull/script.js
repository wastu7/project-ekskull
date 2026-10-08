const modal = document.getElementById("interactionModal");
const interactionBtn = document.getElementById("interactionBtn");
const modalClose = document.getElementById("modalClose");
const checkBtn = document.getElementById("checkBtn");
const otherDrug = document.getElementById("otherDrug");
const result = document.getElementById("result");
const backBtn = document.getElementById("backBtn");
const loginBtn = document.getElementById("loginBtn");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  otherDrug.focus();
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  result.textContent = "";
  otherDrug.value = "";
}

interactionBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});

checkBtn.addEventListener("click", () => {
  const drug = otherDrug.value.trim();

  if (!drug) {
    result.textContent = "Silakan masukkan nama obat terlebih dahulu.";
    return;
  }

  result.textContent =
    `Data interaksi "${drug}" dengan Darumas belum tersedia pada demo ini.`;
});

backBtn.addEventListener("click", () => {
  if (history.length > 1) {
    history.back();
  } else {
    alert("Demo: kembali ke halaman hasil pencarian.");
  }
});

loginBtn.addEventListener("click", () => {
  alert("Demo: halaman login SmartMed.");
});
