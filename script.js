// ============================================================
// DOM ELEMENTS  —  ดึง element จาก HTML มาเก็บในตัวแปร
//   ทำครั้งเดียวตอนโหลด เพื่อไม่ต้อง querySelector ซ้ำ
// ============================================================

// ปุ่มหลัก
let openBtn       = document.getElementById("add");
let submitBtn     = document.getElementById("submitBtn");
let cancelBtn     = document.getElementById("cancelBtn");

// พื้นที่หลัก
let formBox       = document.getElementById("formBox");
let board         = document.getElementById("board");
let warningBox    = document.getElementById("warningBox");

// ช่องกรอกข้อมูลในฟอร์ม
let nameInput     = document.getElementById("nameInput");
let projectName   = document.getElementById("projectName");
let datestart     = document.getElementById("datestart");
let deadline      = document.getElementById("deadline");
let statusInput   = document.getElementById("statusInput");
let detail        = document.getElementById("detail");
let reward        = document.getElementById("reward");

// sidebar และ settings
let sidebar       = document.getElementById("sidebar");
let sidebarToggle = document.getElementById("sidebarToggle");
let settingsBtn   = document.getElementById("settingsBtn");
let settingsPanel = document.getElementById("settingsPanel");
let darkModeSwitch = document.getElementById("darkModeSwitch");


// ============================================================
// WARNING  —  แสดงกล่องแจ้งเตือนแล้วซ่อนอัตโนมัติ 3 วินาที
// ============================================================

function showWarning(message) {
  warningBox.textContent = message;
  warningBox.style.display = "block";
  setTimeout(() => {
    warningBox.style.display = "none";
  }, 3000);
}


// ============================================================
// OPEN FORM  —  กดปุ่ม + เปิดฟอร์มเพิ่มงาน
// ============================================================

openBtn.addEventListener("click", function () {
  formBox.classList.remove("hidden");
});


// ============================================================
// CLOSE FORM  —  กดยกเลิก: reset ฟอร์มแล้วซ่อน
// ============================================================

cancelBtn.addEventListener("click", function () {
  formBox.reset();
  formBox.classList.add("hidden");
});


// ============================================================
// SUBMIT FORM  —  บันทึกงานใหม่เป็นการ์ดบนบอร์ด
//
//   ขั้นตอน:
//   1. validate — ถ้าทั้ง nameInput และ projectName ว่าง → แจ้งเตือน
//   2. ตั้งค่า default "-" ให้ช่องที่ว่าง (ไม่ return ให้สร้างการ์ดต่อ)
//   3. อ่านค่าทุกช่องหลัง validate เสร็จ
//   4. สร้าง div.postIt แล้ว append ลง board
//   5. reset ฟอร์มและซ่อน
// ============================================================

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // 1. validate
  if (nameInput.value === "" && projectName.value === "") {
    showWarning("กรุณากรอกชื่อและชื่อโปรเจค");
    return;
  }

  // 2. default values
  if (nameInput.value   === "") nameInput.value   = "-";
  if (projectName.value === "") projectName.value = "-";
  if (detail.value      === "") detail.value      = "-";
  if (reward.value      === "") reward.value      = "-";

  // 3. อ่านค่า
  let name          = nameInput.value;
  let project       = projectName.value;
  let date          = datestart.value;
  let Deadline      = deadline.value;
  let statusproject = statusInput.value;
  let detailproject = detail.value;
  let rewardproject = reward.value;

  // 4. สร้างการ์ด  |  class "status-xxx" ใช้ filter กรองภายหลัง
  let card = document.createElement("div");
  card.className = `postIt status-${statusproject}`;
  card.innerHTML =
    `<h1>ชื่อลูกค้า: ${name}</h1>` +
    `<p>ชื่อโปรเจค: ${project}</p>` +
    `<p>วันเริ่มงาน: ${date}</p>` +
    `<p>วันส่งงาน: ${Deadline}</p>` +
    `<p>สถานะ: ${statusproject}</p>` +
    `<p>ค่าจ้าง: ${rewardproject}</p>` +
    `<p>รายละเอียด: ${detailproject}</p>` +
    `<button class="deleteBtn">x</button>`;

  board.appendChild(card);

  // 5. เคลียร์ฟอร์ม
  formBox.reset();
  formBox.classList.add("hidden");
});


// ============================================================
// DELETE CARD  —  event delegation บน board
//   ดักคลิกที่ปุ่ม .deleteBtn แล้วลบ .postIt ที่ครอบอยู่
// ============================================================

board.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("deleteBtn")) {
    e.target.closest(".postIt").remove();
  }
});


// ============================================================
// EDIT CARD  —  กด .postItEdit บนการ์ด
//   ดึงข้อมูลกลับเข้าฟอร์ม แล้วลบการ์ดเดิมออก
// ============================================================

board.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("postItEdit")) {
    let postIt = e.target.closest(".postIt");
    let lines  = postIt.innerText.split("\n");

    nameInput.value   = lines[0]?.replace("ชื่อลูกค้า: ", "")  || "";
    projectName.value = lines[1]?.replace("ชื่อโปรเจค: ", "")  || "";
    datestart.value   = lines[2]?.replace("วันเริ่มงาน: ", "") || "";
    deadline.value    = lines[3]?.replace("วันส่งงาน: ", "")   || "";
    statusInput.value = lines[4]?.replace("สถานะ: ", "")       || "";
    reward.value      = lines[5]?.replace("ค่าจ้าง: ", "")     || "";
    detail.value      = lines[6]?.replace("รายละเอียด: ", "")  || "";

    nameInput.focus();
    postIt.remove();
    formBox.classList.remove("hidden");
  }
});


// ============================================================
// LOCAL STORAGE — บันทึก/โหลดบอร์ด
//
//   บันทึก: ใช้ outerHTML เพื่อเก็บ class status-xxx ด้วย
//   โหลด:   ใส่ outerHTML ตรงๆ ไม่ต้อง wrap ซ้ำ
// ============================================================

function saveCurrentBoardToLocalStorage() {
  const postIts    = document.querySelectorAll("#board .postIt");
  const dataToSave = [];
  postIts.forEach((postIt) => dataToSave.push(postIt.outerHTML));
  localStorage.setItem("savedPostItsData", JSON.stringify(dataToSave));
}

function loadBoardFromLocalStorage() {
  const savedData = localStorage.getItem("savedPostItsData");
  if (savedData) {
    board.innerHTML = JSON.parse(savedData).join("");
  }
}

// โหลดเมื่อ DOM พร้อม
window.addEventListener("DOMContentLoaded", loadBoardFromLocalStorage);

// บันทึกอัตโนมัติทุกครั้งที่คลิก (delay 50ms ให้ DOM update ก่อน)
document.addEventListener("click", function () {
  setTimeout(saveCurrentBoardToLocalStorage, 50);
});


// ============================================================
// FILTER  —  คัดแยกการ์ดตามสถานะ
//
//   แต่ละปุ่มมี data-filter ตรงกับ class "status-xxx" บนการ์ด
//   "all" = โชว์ทุกใบ
// ============================================================

let menuButtons = document.querySelectorAll(".menu button");

menuButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // ย้าย active ไปที่ปุ่มที่กด
    menuButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    let filter = btn.dataset.filter;
    let cards  = document.querySelectorAll("#board .postIt");

    cards.forEach(function (card) {
      let match = filter === "all" || card.classList.contains("status-" + filter);
      card.style.display = match ? "" : "none";
    });
  });
});


// ============================================================
// SIDEBAR  —  พับ/ขยาย + จำสถานะไว้ใน localStorage
// ============================================================

// โหลดสถานะที่บันทึกไว้
if (localStorage.getItem("sidebarCollapsed") === "yes") {
  sidebar.classList.add("collapsed");
  sidebarToggle.textContent = "›";
}

sidebarToggle.addEventListener("click", function () {
  sidebar.classList.toggle("collapsed");

  if (sidebar.classList.contains("collapsed")) {
    localStorage.setItem("sidebarCollapsed", "yes");
    sidebarToggle.textContent = "›";
  } else {
    localStorage.setItem("sidebarCollapsed", "no");
    sidebarToggle.textContent = "‹";
  }
});


// ============================================================
// SETTINGS PANEL  —  เปิด/ปิด popup
//   stopPropagation ป้องกัน click event ฟองขึ้นไปปิด panel ทันที
//   คลิกนอก panel → ปิดอัตโนมัติ
// ============================================================

settingsBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  settingsPanel.classList.toggle("hidden");
});

document.addEventListener("click", function (e) {
  if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
    settingsPanel.classList.add("hidden");
  }
});


// ============================================================
// DARK MODE  —  toggle ผ่าน checkbox ใน settings panel
//   จำสถานะไว้ใน localStorage
// ============================================================

// โหลดสถานะที่บันทึกไว้
if (localStorage.getItem("darkMode") === "on") {
  document.body.classList.add("dark");
  darkModeSwitch.checked = true;
}

darkModeSwitch.addEventListener("change", function () {
  if (darkModeSwitch.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "on");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "off");
  }
});
