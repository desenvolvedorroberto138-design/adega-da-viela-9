import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDi9qk5AgTUUCKNdGB4_V9VLdNpu3b3zBE",
  authDomain: "adegaviela9.firebaseapp.com",
  projectId: "adegaviela9",
  storageBucket: "adegaviela9.firebasestorage.app",
  messagingSenderId: "807712318578",
  appId: "1:807712318578:web:074dd0b72376a97f96ceeb"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Exporta para usar em outros arquivos (main.js, admin.js, etc)
export { db, auth, storage };