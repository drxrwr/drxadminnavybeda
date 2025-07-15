const fileColumns = document.getElementById("fileColumns");

// Buat 20 kolom file input
for (let i = 1; i <= 20; i++) {
  const box = document.createElement("div");
  box.className = "file-box";

  const filename = document.createElement("input");
  filename.placeholder = `Nama file untuk kolom ${i}`;
  filename.className = "file-name";

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Isi nomor (satu per baris)";

  const button = document.createElement("button");
  button.textContent = "Download .vcf";
  button.addEventListener("click", () => {
    generateVCF(filename.value.trim(), textarea.value.trim());
  });

  box.appendChild(filename);
  box.appendChild(textarea);
  box.appendChild(button);
  fileColumns.appendChild(box);
}

function generateVCF(fileName, rawText) {
  const namaGlobal = document.getElementById("namaGlobal").value.trim();
  const tipeFile = document.getElementById("tipeFile").value;
  const urutan = document.getElementById("urutan").value;
  const jumlahAwal = parseInt(document.getElementById("jumlahAwal").value) || 1;
  const extraNomor = document.getElementById("extraNomor").value.trim().split('\n').filter(Boolean);
  const pakaiNamaFile = document.getElementById("pakaiNamaFile").checked;

  let numbers = rawText
    .split('\n')
    .map(n => n.replace(/[^\d+]/g, ''))
    .map(n => n.startsWith('+') || n.startsWith('0') ? n : '+' + n)
    .filter(n => /^([+\d]{10,})$/.test(n));

  if (urutan === "bawah") numbers = numbers.reverse();

  const contacts = [];
  let counter = jumlahAwal - 1;

  numbers.forEach((num) => {
    counter++;
    const nomorFormat = String(counter).padStart(3, '0');
    const label = pakaiNamaFile && fileName
      ? `${namaGlobal} ${fileName} ${nomorFormat}`
      : `${namaGlobal} ${nomorFormat}`;
    contacts.push({ name: label, phone: num });
  });

  extraNomor.forEach((n) => {
    const nomor = n.replace(/[^\d+]/g, '');
    const nomorFix = nomor.startsWith('+') || nomor.startsWith('0') ? nomor : '+' + nomor;
    if (/^([+\d]{10,})$/.test(nomorFix)) {
      counter++;
      const nomorFormat = String(counter).padStart(3, '0');
      const label = pakaiNamaFile && fileName
        ? `${namaGlobal} ${fileName} ${nomorFormat}`
        : `${namaGlobal} ${nomorFormat}`;
      contacts.push({ name: label, phone: nomorFix });
    }
  });

  let vcfContent = contacts
    .map(
      (c) => `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL;TYPE=CELL:${c.phone}\nEND:VCARD`
    )
    .join('\n');

  const blob = new Blob([vcfContent], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${tipeFile} ${fileName || 'contacts'}.vcf`;
  a.click();
}

function isiOtomatis() {
  const rangeInput = document.getElementById("rangeNomor").value.trim();
  const perBagian = parseInt(document.getElementById("perBagian").value.trim());

  if (!/^(\d+)-(\d+)$/.test(rangeInput) || isNaN(perBagian) || perBagian <= 0) {
    alert("Isi format rentang dengan benar, contoh: 123-152 dan bagi per berapa.");
    return;
  }

  const [mulai, akhir] = rangeInput.split('-').map(Number);
  const total = akhir - mulai + 1;
  const fileInputs = document.querySelectorAll(".file-name");

  let counter = 0;
  for (let i = 0; i < total; i += perBagian) {
    const from = mulai + i;
    const to = Math.min(mulai + i + perBagian - 1, akhir);
    if (fileInputs[counter]) {
      fileInputs[counter].value = `${from}-${to}`;
      counter++;
    } else {
      break;
    }
  }
}

function hapusOtomatis() {
  const fileInputs = document.querySelectorAll(".file-name");
  const textareas = document.querySelectorAll(".file-box textarea");
  fileInputs.forEach(input => input.value = "");
  textareas.forEach(area => area.value = "");
}
