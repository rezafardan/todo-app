// Meload web dan menjalankan beberapa fungsi
document.addEventListener("DOMContentLoaded", function () {
  loadTodoList(); // menjalankan fungsi load dari localstorage

  document
    .getElementById("deleteDoneBtn")
    .addEventListener("click", function () {
      deleteAllDoneItems();
    }); // fungsi addEvent jika di tekan tombol Delete All

  // menampilkan hari dan tanggal di header
  const waktu = new Date();
  const hari = waktu.getDate();
  const bulan = waktu.getMonth() + 1;
  const tahun = waktu.getFullYear();
  const tanggalSekarang = hari + "/" + bulan + "/" + tahun;
  const hariIndex = waktu.getDay();
  const namaHari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const hariIni = namaHari[hariIndex];
  const thisDay = (document.getElementById("waktu").textContent =
    hariIni + ", " + tanggalSekarang);
  return thisDay;
});

// Membuat form inputan bisa di kirim ke list todo
document.getElementById("input-area").addEventListener("submit", function (e) {
  e.preventDefault();

  // mengambil isi dari input area
  const prioritas = document.getElementById("prioritas").value;
  const judultodo = document.getElementById("judul-todo").value;

  // menambahkan todo ke daftar todoItem
  const todoItem = {
    id: new Date().getTime(),
    judul: judultodo,
    prioritas: prioritas,
    completed: false,
  };

  // fungsi menambah todolist ke todo item
  addTodoToList(todoItem);

  // reset input area
  document.getElementById("input-area").reset();
});

// fungsi menambahkan todolist
function addTodoToList(todoItem) {
  // variabel list todo dan membuat div baru untuk menampung list todo
  const list = todoItem.completed
    ? document.getElementById("list-done")
    : document.getElementById("list-todo");
  const listTodo = document.createElement("div"); // menambahkan element div ke list todo
  listTodo.className = "list-todo-item"; // memberi class ke list todo
  listTodo.dataset.id = todoItem.id; // mensetting agar item todo di listtodo berisi id dari item todo

  if (todoItem.completed) {
    listTodo.classList.add("completed");
  }

  // menampilkan id
  const itemId = document.createElement("div");
  itemId.classList.add("id-item");
  itemId.dataset.id = todoItem.id;

  // menampilkan badge warna prioritas
  const badgePrioritas = document.createElement("div");
  badgePrioritas.textContent = todoItem.prioritas;
  badgePrioritas.classList.add("badge-prioritas", todoItem.prioritas);

  // menampilkan tombol checkbox
  const tombolCheckbox = document.createElement("input");
  tombolCheckbox.type = "checkbox";
  tombolCheckbox.className = "checkbox";
  tombolCheckbox.checked = todoItem.completed;
  tombolCheckbox.addEventListener("change", function () {
    markAsDone(todoItem.id, tombolCheckbox.checked);
  });

  // mengambil judul dan tanggal
  const listJudul = document.createElement("div");
  listJudul.classList.add("judul");
  listJudul.textContent = todoItem.judul;

  // menampilkan hari dan tanggal
  const waktu = new Date();
  const hari = waktu.getDate();
  const bulan = waktu.getMonth() + 1;
  const tahun = waktu.getFullYear();
  const hariIndex = waktu.getDay();
  const namaHari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const hariIni = namaHari[hariIndex];
  const tanggalSekarang = hari + "/" + bulan + "/" + tahun;
  const listTanggal = document.createElement("div");
  listTanggal.classList.add("tanggal");
  listTanggal.textContent = `${hariIni}, ${tanggalSekarang}`;

  // menampilkan tombol delete
  const tombolDelete = document.createElement("button");
  tombolDelete.className = "tombol-delete";
  tombolDelete.innerHTML = "␡";
  tombolDelete.addEventListener("click", function () {
    deleteTodoItem(todoItem.id);
  });

  // menampilkan tombol delete all
  const deleteBtn = document.createElement("button");
  deleteBtn.addEventListener("click", function () {
    deleteTodoItem(todoItem.id);
    list.removeChild(listTodo);
  });

  // menambahkan item list
  listTodo.appendChild(badgePrioritas);
  listTodo.appendChild(tombolCheckbox);
  listTodo.appendChild(listTanggal);
  listTodo.appendChild(listJudul);
  listTodo.appendChild(tombolDelete);
  list.appendChild(listTodo);

  // fungsi save seluruh data item ke local storage
  saveTodoToLocalStorage(todoItem);
}

// fungsi save todo ke local storage
function saveTodoToLocalStorage(todoItem) {
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  const index = todoList.findIndex((item) => item.id === todoItem.id);

  if (index === -1) {
    todoList.push(todoItem);
  } else {
    todoList[index] = todoItem;
  }
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

// fungsi load todo untuk ditampilkan lagi
function loadTodoList() {
  document.getElementById("list-todo").innerHTML = "";
  document.getElementById("list-done").innerHTML = "";

  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  todoList.forEach(function (todoItem) {
    addTodoToList(todoItem);
  });
}

// fungsi delete todo dari list
function deleteTodoItem(id) {
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  todoList = todoList.filter(function (todoItem) {
    return todoItem.id !== id;
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));

  const itemElement = document.querySelector(
    `.list-todo-item[data-id="${id}"]`
  );
  if (itemElement) {
    itemElement.remove();
  }
}

// fungsi menandai todo completed dan dipindah ke tab done
function markAsDone(id, isChecked) {
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  const todoItem = todoList.find((item) => item.id === id);

  if (todoItem) {
    todoItem.completed = isChecked;
    saveTodoToLocalStorage(todoItem);

    const itemId = document.querySelector(`.list-todo-item[data-id="${id}"]`);
    if (itemId) {
      itemId.remove();

      if (isChecked) {
        itemId.classList.add("completed");
        document.getElementById("list-done").appendChild(itemId);
      } else {
        itemId.classList.remove("completed");
        document.getElementById("list-todo").appendChild(itemId);
      }
    }
  }
}

// fungsi menghapus semua todo yang selesai
function deleteAllDoneItems() {
  let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  todoList = todoList.filter(function (todoItem) {
    return !todoItem.completed; // menyimpan item todo yang belum selesai
  });
  localStorage.setItem("todoList", JSON.stringify(todoList));

  // menghapus semua elemen dari tampilan list-done
  const listDone = document.getElementById("list-done");
  listDone.innerHTML = "";
}
