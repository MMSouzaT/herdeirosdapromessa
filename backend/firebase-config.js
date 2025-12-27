// Configuração do Firebase
// IMPORTANTE: Substitua pelos valores do seu projeto Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializar Firebase
let app, auth, db, storage;

function initializeFirebase() {
  if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    console.log('Firebase inicializado com sucesso');
    return true;
  } else {
    console.error('Firebase SDK não carregado');
    return false;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDB = db;
  window.firebaseStorage = storage;
  window.initializeFirebase = initializeFirebase;
}
