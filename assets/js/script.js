const checklistTable = document.querySelector("#checklist tbody");
const checklistHeaderRow = document.querySelector("#checklist thead tr");
const downloadJsonBtn = document.getElementById("downloadJson");
const downloadExcelBtn = document.getElementById("downloadExcel");
const tabsContainer = document.querySelector(".tabs");

let data = {};
let currentTab = "";

async function loadExcelFile() {

  try {
    const response = await fetch("data/eterspire_familiars.xlsx");
    if (!response.ok) throw new Error("No se pudo cargar el archivo Excel.");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const sheetNames = workbook.SheetNames;
    sheetNames.forEach((sheetName, index) => {
      const button = document.createElement("button");
      button.className = `tab-button ${index === 0 ? "active" : ""}`;
      button.setAttribute("data-tab", sheetName);
      button.textContent = sheetName;
      tabsContainer.appendChild(button);

      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      data[sheetName] = sheetData;

      button.addEventListener("click", () => {
        if (sheetName !== currentTab) {
          document.querySelector(".tab-button.active").classList.remove("active");
          button.classList.add("active");
          currentTab = sheetName;
          updateChecklist(data[currentTab]);
        }
      });
    });

    currentTab = sheetNames[0];

    if (data[currentTab] && data[currentTab].length > 0) {
      updateChecklist(data[currentTab]);
    } else {
      console.warn("No hay datos disponibles para actualizar la tabla.");
    }
  } catch (error) {
    console.error("Error cargando el archivo Excel:", error);
  }
}

function updateChecklist(items) {
  checklistTable.innerHTML = "";
  checklistHeaderRow.innerHTML = "";

  const columns = Object.keys(items[0]);
  const imageIndex = columns.indexOf('Image');
  if (imageIndex > 0) {
    columns.splice(imageIndex, 1);
    columns.unshift('Image');
  }

  const checkboxHeader = document.createElement("th");
  checkboxHeader.textContent = "Select";
  checkboxHeader.style.cursor = "pointer";
  checkboxHeader.addEventListener("click", () => {
    const checkboxes = checklistTable.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach(checkbox => {
      checkbox.checked = !allChecked;
      const event = new Event('change');
      checkbox.dispatchEvent(event);
    });
  });
  checklistHeaderRow.appendChild(checkboxHeader);

  columns.forEach((col) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = col;
    checklistHeaderRow.appendChild(headerCell);
  });

  items.forEach((item, index) => {
    const row = document.createElement("tr");

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `item-${index}`;
    checkbox.checked = item.checked || false;
    checkbox.addEventListener("change", () => {
      item.checked = checkbox.checked;
      saveChecklistState();
      updateRowStyle(row, checkbox.checked);
    });
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    columns.forEach((col) => {
      const cell = document.createElement("td");
      if (col === 'Image') {
        const rawValue = item[col];
        const imgElement = document.createElement("img");
        const isUrl = typeof rawValue === 'string' && /^https?:\/\//i.test(rawValue);

        let localName = '';
        if (isUrl) {
          const lastSegment = rawValue.split('/').pop();
          const withoutThumbPrefix = lastSegment.replace(/^\d+px-/, '');
          try {
            localName = decodeURIComponent(withoutThumbPrefix);
          } catch (e) {
            localName = withoutThumbPrefix;
          }
        } else if (typeof rawValue === 'string') {
          localName = rawValue.trim().replace(/\s+/g, '_').replace(/[^\w\-.]/g, '') + '.webp';
        }

        imgElement.src = localName ? `assets/img/${localName}` : (isUrl ? rawValue : "assets/img/logo_eterspire.png");

        imgElement.alt = typeof rawValue === 'string' ? rawValue : '';
        imgElement.style.width = "50px";
        imgElement.style.height = "auto";
        imgElement.onerror = () => {
          if (isUrl && imgElement.src !== rawValue) {
            imgElement.src = rawValue;
          } else {
            imgElement.onerror = null;
            imgElement.src = "assets/img/logo_eterspire.png";
            imgElement.alt = "Eterspire";
          }
        };
        cell.appendChild(imgElement);
      } else {
        cell.textContent = item[col] || "";
      }

      row.appendChild(cell);
    });

    updateRowStyle(row, checkbox.checked);
    checklistTable.appendChild(row);
  });
}

function updateRowStyle(row, isChecked) {
  const color = isChecked ? '#2f6b2f' : '#8b2e2e';
  row.style.color = color;
}

downloadJsonBtn.addEventListener("click", () => {
  const jsonBlob = new Blob([JSON.stringify(data[currentTab], null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(jsonBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentTab}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

downloadExcelBtn.addEventListener("click", () => {
  const worksheet = XLSX.utils.json_to_sheet(data[currentTab]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, currentTab);
  XLSX.writeFile(workbook, `${currentTab}.xlsx`);
});

const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("visible", window.scrollY > 300);
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function saveChecklistState() {
  localStorage.setItem('eterspireChecklistState', JSON.stringify(data));
}

function loadChecklistState() {
  const savedState = localStorage.getItem('eterspireChecklistState');
  if (savedState) {
    data = JSON.parse(savedState);
    if (data[currentTab] && data[currentTab].length > 0) {
      updateChecklist(data[currentTab]);
    }
  }
}

loadExcelFile().then(loadChecklistState);
