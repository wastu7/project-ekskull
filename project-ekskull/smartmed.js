/* Additive front-end demo features for SmartMed. No backend or real authentication. */
(() => {
  const medicines = [
    {
      name: "Paracetamol",
      terms: "demam nyeri sakit kepala analgesik",
      use: "Informasi umum: obat ini lazim digunakan untuk membantu meredakan nyeri ringan dan demam.",
      caution: "Ikuti petunjuk pada kemasan atau arahan tenaga kesehatan. Hindari penggunaan bersamaan dengan produk lain yang juga mengandung paracetamol tanpa memastikan kandungannya."
    },
    {
      name: "Ibuprofen",
      terms: "nyeri demam peradangan sakit gigi",
      use: "Informasi umum: ibuprofen termasuk obat antiinflamasi nonsteroid yang dapat digunakan untuk nyeri dan peradangan.",
      caution: "Tidak cocok untuk semua orang. Tanyakan kepada tenaga kesehatan terutama bila memiliki riwayat gangguan lambung, ginjal, alergi obat, sedang hamil, atau menggunakan obat lain."
    },
    {
      name: "Cetirizine",
      terms: "alergi bersin gatal pilek",
      use: "Informasi umum: cetirizine merupakan antihistamin yang digunakan untuk membantu meredakan gejala alergi.",
      caution: "Obat dapat menyebabkan kantuk pada sebagian orang. Baca label dan tanyakan kepada tenaga kesehatan bila ragu."
    },
    {
      name: "Amoxicillin",
      terms: "antibiotik infeksi bakteri",
      use: "Informasi umum: amoxicillin adalah antibiotik untuk infeksi bakteri tertentu berdasarkan penilaian tenaga kesehatan.",
      caution: "Antibiotik harus digunakan sesuai resep. Tidak digunakan untuk flu atau infeksi virus; jangan memulai, menghentikan, atau membagikan antibiotik tanpa arahan dokter."
    },
    {
      name: "Omeprazole",
      terms: "asam lambung maag refluks ulu hati",
      use: "Informasi umum: omeprazole mengurangi produksi asam lambung dan digunakan pada kondisi tertentu sesuai arahan tenaga kesehatan.",
      caution: "Periksa petunjuk kemasan dan konsultasikan bila gejala menetap, memburuk, atau disertai tanda bahaya."
    }
  ];

  const conditions = [
    { name: "Demam", symptoms: "Suhu tubuh meningkat dan dapat disertai menggigil atau rasa lemas.", advice: "Cukupi cairan dan pantau kondisi. Cari pertolongan medis bila demam berat, berlangsung lama, atau disertai sesak, kebingungan, kejang, maupun tanda bahaya lain." },
    { name: "Alergi", symptoms: "Dapat berupa bersin, hidung berair, mata gatal, atau ruam; pemicunya berbeda pada tiap orang.", advice: "Hindari pemicu yang diketahui. Gejala berat seperti sulit bernapas atau pembengkakan wajah/lidah memerlukan pertolongan darurat." },
    { name: "Sakit kepala", symptoms: "Nyeri atau rasa tidak nyaman di kepala dengan penyebab yang beragam.", advice: "Istirahat dan perhatikan pemicu. Sakit kepala mendadak sangat berat, setelah cedera, atau disertai kelemahan/kebingungan perlu segera dinilai tenaga medis." },
    { name: "Asam lambung", symptoms: "Rasa panas di dada atau rasa asam yang naik ke tenggorokan dapat terjadi pada refluks.", advice: "Gejala berulang sebaiknya dibicarakan dengan tenaga kesehatan. Nyeri dada berat atau sesak perlu penilaian segera." }
  ];

  const knownInteractions = [
    {
      a: "warfarin", b: "aspirin",
      text: "Kombinasi warfarin dan aspirin dapat meningkatkan risiko perdarahan. Jangan mengubah atau menghentikan obat resep sendiri; segera tanyakan kepada dokter atau apoteker yang mengetahui kondisi Anda."
    }
  ];

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function openDialog(title, body, onReady) {
    closeDialog();
    const overlay = document.createElement("div");
    overlay.className = "smartmed-overlay";
    overlay.setAttribute("role", "presentation");
    overlay.innerHTML = `<section class="smartmed-dialog" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}"><button class="smartmed-close" type="button" aria-label="Tutup">×</button><h2>${escapeHTML(title)}</h2>${body}</section>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".smartmed-close").addEventListener("click", closeDialog);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeDialog();
    });
    if (onReady) onReady(overlay);
    overlay.querySelector("input, button, a")?.focus();
    return overlay;
  }

  function closeDialog() {
    document.querySelector(".smartmed-overlay")?.remove();
  }

  function showMedicineSearch(query = "") {
    const initial = escapeHTML(query);
    const body = `<p>Cari berdasarkan nama obat atau kata kunci gejala. Informasi di bawah ini adalah contoh edukasi, bukan rekomendasi pengobatan pribadi.</p>
      <form class="smartmed-form" id="medicineSearchForm">
        <label for="medicineQuery">Nama obat atau gejala</label>
        <input id="medicineQuery" type="search" value="${initial}" placeholder="Contoh: paracetamol atau demam">
        <button class="smartmed-submit" type="submit">Cari informasi</button>
      </form>
      <div id="medicineResults" class="smartmed-list" aria-live="polite"></div>
      <div class="smartmed-warning">Data demo terbatas dan tidak menggantikan label obat, resep, atau konsultasi dokter/apoteker. Tidak ditemukan bukan berarti obat aman atau tidak memiliki risiko.</div>`;
    const dialog = openDialog("Cari informasi obat", body, (root) => {
      const form = root.querySelector("#medicineSearchForm");
      const input = root.querySelector("#medicineQuery");
      const results = root.querySelector("#medicineResults");
      const render = (term) => {
        const normalized = term.trim().toLocaleLowerCase("id");
        const matches = normalized
          ? medicines.filter((item) => `${item.name} ${item.terms}`.toLocaleLowerCase("id").includes(normalized))
          : medicines;
        results.innerHTML = matches.length
          ? matches.map((item) => `<article class="smartmed-item"><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.use)}</p><p><strong>Perhatian:</strong> ${escapeHTML(item.caution)}</p></article>`).join("")
          : `<p class="smartmed-empty">Belum ada data demo yang cocok. Coba kata kunci lain atau tanyakan langsung kepada apoteker.</p>`;
      };
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        render(input.value);
      });
      render(query);
    });
    return dialog;
  }

  function showConditions(query = "") {
    const normalized = query.trim().toLocaleLowerCase("id");
    const matches = normalized
      ? conditions.filter((item) => `${item.name} ${item.symptoms}`.toLocaleLowerCase("id").includes(normalized))
      : conditions;
    const content = matches.length
      ? `<div class="smartmed-list">${matches.map((item) => `<article class="smartmed-item"><h3>${escapeHTML(item.name)}</h3><p><strong>Gambaran umum:</strong> ${escapeHTML(item.symptoms)}</p><p><strong>Perhatian:</strong> ${escapeHTML(item.advice)}</p></article>`).join("")}</div>`
      : `<p class="smartmed-empty">Belum ada informasi demo yang cocok dengan pencarian tersebut.</p>`;
    openDialog("Info penyakit dan gejala", `<p>Ringkasan edukasi umum. Informasi ini tidak digunakan untuk mendiagnosis atau menentukan terapi.</p>${content}<div class="smartmed-warning">Segera cari pertolongan medis untuk gejala berat atau kondisi darurat. Diagnosis dan pilihan pengobatan harus dilakukan oleh tenaga kesehatan.</div>`);
  }

  function showInteractionChecker(first = "") {
    const body = `<p>Masukkan dua nama obat untuk memeriksa contoh interaksi yang tersedia di demo ini.</p>
      <form class="smartmed-form" id="interactionForm">
        <label for="interactionDrugOne">Obat pertama<input id="interactionDrugOne" required value="${escapeHTML(first)}" placeholder="Contoh: warfarin"></label>
        <label for="interactionDrugTwo">Obat kedua<input id="interactionDrugTwo" required placeholder="Contoh: aspirin"></label>
        <button class="smartmed-submit" type="submit">Cek interaksi</button>
        <p class="smartmed-message" id="interactionMessage" role="status"></p>
      </form>
      <div class="smartmed-warning">Pemeriksa ini hanya mencakup satu contoh dan bukan basis data medis lengkap. Hasil “belum tersedia” tidak berarti kombinasi aman. Konfirmasikan semua obat, suplemen, dan kondisi kesehatan kepada dokter/apoteker.</div>`;
    openDialog("Cek interaksi obat", body, (root) => {
      root.querySelector("#interactionForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const one = root.querySelector("#interactionDrugOne").value.trim().toLocaleLowerCase("id");
        const two = root.querySelector("#interactionDrugTwo").value.trim().toLocaleLowerCase("id");
        const match = knownInteractions.find((pair) => (pair.a === one && pair.b === two) || (pair.a === two && pair.b === one));
        const message = root.querySelector("#interactionMessage");
        message.textContent = match
          ? match.text
          : "Informasi interaksi kombinasi ini belum tersedia di demo. Itu bukan konfirmasi bahwa kombinasi aman—periksa kepada dokter atau apoteker.";
      });
    });
  }

  function showLogin() {
    const savedName = localStorage.getItem("smartmedDemoName") || "";
    const content = savedName
      ? `<p>Anda masuk sebagai <strong>${escapeHTML(savedName)}</strong> pada demo ini.</p><button class="smartmed-action" id="demoLogout" type="button">Keluar dari demo</button><p class="smartmed-warning">Ini hanya simulasi lokal di browser, bukan akun SmartMed sungguhan.</p>`
      : `<p>Masuk demo untuk melihat alur formulir. Akun tidak diverifikasi dan tidak ada layanan server.</p>
        <form class="smartmed-form" id="loginForm">
          <label for="loginName">Nama<input id="loginName" required autocomplete="name" placeholder="Nama Anda"></label>
          <label for="loginEmail">Email<input id="loginEmail" required type="email" autocomplete="email" placeholder="nama@email.com"></label>
          <label for="loginPassword">Kata sandi<input id="loginPassword" required type="password" minlength="6" autocomplete="current-password" placeholder="Minimal 6 karakter"></label>
          <button class="smartmed-submit" type="submit">Masuk (demo)</button>
          <p class="smartmed-message" id="loginMessage" role="status"></p>
        </form>
        <div class="smartmed-warning">Jangan gunakan kata sandi asli. Form ini tidak mengirim atau menyimpan kata sandi; autentikasi sungguhan memerlukan backend yang aman.</div>`;
    openDialog("Masuk ke SmartMed", content, (root) => {
      root.querySelector("#loginForm")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = root.querySelector("#loginName").value.trim();
        localStorage.setItem("smartmedDemoName", name);
        root.querySelector("#loginPassword").value = "";
        showLogin();
      });
      root.querySelector("#demoLogout")?.addEventListener("click", () => {
        localStorage.removeItem("smartmedDemoName");
        closeDialog();
      });
    });
  }

  function onClick(event) {
    const login = event.target.closest(".login-btn, #loginBtn");
    if (login) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showLogin();
      return;
    }

    const link = event.target.closest("a");
    if (!link) return;
    const label = `${link.textContent} ${link.getAttribute("href") || ""}`.toLocaleLowerCase("id");
    if (label.includes("interaksi")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showInteractionChecker();
    } else if (label.includes("penyakit") || label.includes("gejala") || link.closest(".feature-card")?.textContent.toLocaleLowerCase("id").includes("penyakit")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showConditions();
    } else if (label.includes("cari obat") || link.closest(".feature-card")?.textContent.toLocaleLowerCase("id").includes("cari obat")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showMedicineSearch();
    }
  }

  document.addEventListener("click", onClick, true);

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "searchForm") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const input = document.getElementById("searchInput");
    const feedback = document.getElementById("searchFeedback");
    const term = input?.value.trim() || "";
    if (!term) {
      if (feedback) feedback.textContent = "Masukkan nama obat, penyakit, atau gejala.";
      input?.focus();
      return;
    }
    if (feedback) feedback.textContent = `Hasil pencarian untuk "${term}" ditampilkan.`;
    const isCondition = conditions.some((item) => `${item.name} ${item.symptoms}`.toLocaleLowerCase("id").includes(term.toLocaleLowerCase("id")));
    if (isCondition) showConditions(term);
    else showMedicineSearch(term);
  }, true);

  document.addEventListener("click", (event) => {
    if (event.target.closest("#interactionBtn")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showInteractionChecker("Darumas");
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDialog();
  });
})();
