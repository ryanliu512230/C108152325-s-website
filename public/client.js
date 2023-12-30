const gallery = document.querySelector(".gallery");
const uploadButton = document.querySelector("#uploadButton");
const fileInput = document.querySelector("#fileInput");

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    uploadPhoto(file);
  }
});

// 開始時載入照片
fetchPhotos();

function fetchPhotos() {
  fetch("http://localhost:3000/api/photos")
    .then((response) => response.json())
    .then((photos) => {
      displayPhotos(photos);
    })
    .catch((error) => console.error("Error fetching photos:", error));
}

function displayPhotos(photos) {
  gallery.innerHTML = "";

  photos.forEach((photo) => {
    createPhotoElement(photo.data, photo.name);
  });
}

function createPhotoElement(base64Data, name) {
  const photoDiv = document.createElement("div");
  photoDiv.classList.add("photo");

  const img = document.createElement("img");
  img.src = `data:image/png;base64, ${base64Data}`;

  img.addEventListener("click", () => {
    displayModal(img.src, name);

    // 在控制台打印 base64 数据
    console.log("Base64 Data:", base64Data);
  });

  const caption = document.createElement("p");

  photoDiv.appendChild(img);
  photoDiv.appendChild(caption);
  gallery.appendChild(photoDiv);
}

function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Photo uploaded successfully");
        return response.json();
      } else {
        throw new Error("Photo upload failed");
      }
    })
    .then((photo) => {
      // 在此處理上傳成功後的邏輯，例如重新載入圖片列表
      fetchPhotos(); // 重新載入圖片列表
    })
    .catch((error) => console.error("Error uploading photo:", error));
}

function displayModal(url, name) {
  //console.log(url);
  console.log(name);
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const img = document.createElement("img");
  img.src = url;

  // 刪除按鈕
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deletePhoto(name);
    modal.remove(); // 刪除圖片後同時關閉模態
  });

  modalContent.appendChild(img);
  modalContent.appendChild(deleteButton);
  modal.appendChild(modalContent);

  modal.addEventListener("click", () => {
    modal.remove();
  });

  document.body.appendChild(modal);
}
function deletePhoto(name) {
    // 发送删除请求到服务器
    fetch(`http://localhost:3000/api/photos/${name}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Photo deleted successfully");
          fetchPhotos(); // 刷新照片列表
        } else {
          throw new Error("Photo deletion failed");
        }
      })
      .catch((error) => console.error("Error deleting photo:", error));
  }
// 每隔一段時間重新載入照片列表
setInterval(fetchPhotos, 1000); // 5000 毫秒（5 秒）為例，可以根據需求調整
