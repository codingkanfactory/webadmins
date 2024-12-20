import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMcax3DSMbwCdf6ilMStGr7-wL3GVf8-Q",
  authDomain: "codingkan.firebaseapp.com",
  databaseURL: "https://codingkan-default-rtdb.firebaseio.com",
  projectId: "codingkan",
  storageBucket: "codingkan.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tokenValue = document.getElementById('token-value');
const tokenIcon = document.getElementById('token-icon');
const classGroupsContainer = document.getElementById('class-groups');
const downloadBtn = document.getElementById('download-btn');

let rekapData = [];

// Load token data
const tokenRef = ref(db, 'codes/current_code');
onValue(tokenRef, (snapshot) => {
  tokenValue.textContent = snapshot.exists() ? snapshot.val() : "Tidak Tersedia";
});

// Change token icon color on click
tokenIcon.addEventListener('click', () => {
  tokenIcon.classList.toggle('clicked');
});

// Load attendance data grouped by class
onValue(ref(db, 'classes'), (snapshot) => {
  classGroupsContainer.innerHTML = '';
  rekapData = [];
  if (snapshot.exists()) {
    const data = snapshot.val();

    for (const [className, classData] of Object.entries(data)) {
      const classGroup = document.createElement('div');
      classGroup.className = 'card mb-4';
      classGroup.style = 'border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px;';
      
      const classTitle = document.createElement('h3');
      classTitle.className = 'card-title';
      classTitle.textContent = `Kelas: ${className}`;
      classGroup.appendChild(classTitle);

      const cardList = document.createElement('div');
      cardList.className = 'row';

      for (const [userId, userData] of Object.entries(classData.users || {})) {
        const userCard = document.createElement('div');
        userCard.className = 'col-12 col-md-4 mb-4';

        userCard.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${userData.name}</h5>
              <p class="card-text">Token: ${userData.token}</p>
              <p class="card-text">Waktu: ${new Date(userData.attendance).toLocaleString()}</p>
              <span class="icon-btn user-icon" data-feather="heart"></span>
            </div>
          </div>
        `;

        // Change user card icon color on click
        const userIcon = userCard.querySelector('.user-icon');
        userIcon.addEventListener('click', () => {
          userIcon.classList.toggle('clicked');
        });

        cardList.appendChild(userCard);

        rekapData.push({
          Kelas: className,
          Nama: userData.name,
          Token: userData.token,
          Waktu: new Date(userData.attendance).toLocaleString()
        });
      }

      classGroup.appendChild(cardList);
      classGroupsContainer.appendChild(classGroup);
    }
  }
});

// Download Rekap XLS
downloadBtn.addEventListener('click', () => {
  const ws = XLSX.utils.json_to_sheet(rekapData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Absensi");
  XLSX.writeFile(wb, "rekap_absensi.xlsx");
});

// Initialize Feather Icons
feather.replace();