// #region Variáveis
const apiUrl = "http://localhost:5000/livros/";
const dataGrid = document.getElementById("dataGrid");
const modalForm = document.getElementById("modal-form");
const modalNotification = document.getElementById("modal-notification");
const modalTitleNotification = document.getElementById(
   "modalTitleNotification"
);
const modalTitleForm = document.getElementById("modalTitle");
const openModal = document.getElementById("openModal");
const closeModalForm = document.getElementById("closeModal");
const closeModalNotification = document.getElementById(
   "closeModalNotification"
);
const saveItem = document.getElementById("saveItem");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const loadingContainer = document.getElementById("loading-container");
let editingItemId = null;

// #endregion

// #region Funções
const fetchItems = async () => {
   handleLoading(true);
   try {
      const response = await fetch(apiUrl);
      const items = await response.json();
      renderGrid(items);
   } catch (error) {
      handleRequestError(error);
   } finally {
      handleLoading(false);
   }
};

const renderGrid = (items) => {
   dataGrid.innerHTML = "";
   if (items.length === 0) {
      dataGrid.innerHTML =
         "<div class='grid-item'>Nenhum livro cadastrado.</div>";
      return;
   }
   items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("grid-item");
      itemElement.innerHTML = `
               <span>📖 ${item.titulo} - ${item.autor}</span>
               <div>
                  <button class="edit" onclick="editItem('${item.id}', '${item.titulo}', '${item.autor}')">✏️</button>
                  <button class="delete" onclick="deleteItem('${item.id}')">🗑️</button>
               </div>
            `;
      dataGrid.appendChild(itemElement);
   });
};

const editItem = (id, titulo, autor) => {
   editingItemId = id;
   bookTitle.value = titulo;
   bookAuthor.value = autor;
   modalTitleForm.textContent = "Editar Livro";
   modalForm.style.display = "flex";
};

const deleteItem = async (id) => {
   handleLoading(true);
   await fetch(`${apiUrl}${id}`, { method: "DELETE" })
      .then((response) => {
         if (response.status !== 200) return handleRequestError(response);
         fetchItems();
      })
      .catch((error) => handleRequestError(error))
      .finally(() => handleLoading(false));
};

const saveOrEditItem = async () => {
   const titulo = bookTitle.value.trim();
   const autor = bookAuthor.value.trim();
   if (!titulo || !autor) return;
   const method = editingItemId ? "PUT" : "POST";
   const url = editingItemId ? `${apiUrl}${editingItemId}` : apiUrl;

   handleLoading(true);
   await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, autor }),
   })
      .then((response) => {
         if (response.status !== 200) return handleRequestError(response);
         modalForm.style.display = "none";
         fetchItems();
      })
      .catch((error) => handleRequestError(error))
      .finally(() => handleLoading(false));
};

const handleRequestError = (error) => {
   modalTitleNotification.textContent = `Ops! Ocorreu um erro ao salvar o livro. - ${error.status}`;
   modalNotification.style.display = "flex";
};

const handleLoading = (isLoading) => {
   loadingContainer.style.display = isLoading ? "flex" : "none";
};

// #endregion

// #region Eventos
saveItem.addEventListener("click", async () => {
   saveOrEditItem();
});

openModal.addEventListener("click", () => {
   editingItemId = null;
   bookTitle.value = "";
   bookAuthor.value = "";
   modalTitleForm.textContent = "Adicionar Livro";
   modalForm.style.display = "flex";
});

closeModalNotification.addEventListener("click", () => {
   modalNotification.style.display = "none";
});

closeModal.addEventListener("click", () => {
   modalForm.style.display = "none";
});

window.addEventListener("click", (e) => {
   if (e.target === modalForm) modalForm.style.display = "none";
   if (e.target === modalNotification) modalNotification.style.display = "none";
});

// #endregion

// Inicialização
fetchItems();
