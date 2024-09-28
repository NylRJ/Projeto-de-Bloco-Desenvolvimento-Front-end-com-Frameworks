import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNUdNgadpJouPjzeG2_dS7QnhiosJYvmU",
    authDomain: "reactprojetobloco.firebaseapp.com",
    projectId: "reactprojetobloco",
    storageBucket: "reactprojetobloco.appspot.com",
    messagingSenderId: "151415121277",
    appId: "1:151415121277:web:b2062cbfed450402f79814",
    measurementId: "G-37YG91LVT1"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();



export { auth, db, googleProvider };
