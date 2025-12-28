const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let uploadedData = null;

// GANTI DENGAN URL WEB APP GOOGLE SCRIPT
const WEB_APP_URL = "PASTE_WEB_APP_URL_DI_SINI";

fileInput.addEventListener("change", handleFile);

cancelBtn.addEventListener("click", resetAll);

confirmBtn.addEventListener("click", sendToGoogle);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    uploadedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    renderPreview(uploadedData);
    cancelBtn.disabled = false;
    confirmBtn.disabled = false;
  };

  reader.readAsArrayBuffer(file);
}

function renderPreview(data) {
  let html = "<table>";
  data.forEach((row, i) => {
    html += "<tr>";
    row.forEach(cell => {
      html += i === 0 ? `<th>${cell}</th>` : `<td>${cell ?? ""}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";
  preview.innerHTML = html;
}

async function sendToGoogle() {
  confirmBtn.disabled = true;

  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: uploadedData })
  });

  const result = await res.json();
  alert(result.message);

  if (result.success) resetAll();
  confirmBtn.disabled = false;
}

function resetAll() {
  uploadedData = null;
  preview.innerHTML = "";
  fileInput.value = "";
  cancelBtn.disabled = true;
  confirmBtn.disabled = true;
}
