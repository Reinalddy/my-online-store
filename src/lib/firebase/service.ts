import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);

export async function retriveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore,collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retriveDataWithId(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();

  return data;
}

export async function signUp(userData: {
  email: string;
  fullname: string;
  phone: string;
  password: string;
  role?: string;
}, callback: (result: {
  status: boolean;
  message: string;
}) => void) {

  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", userData.email),
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Jika email sudah terdaftar
    if (data.length > 0) {
      callback({ status: false, message: 'Email already registered' });
    } else {
      // Set default role jika tidak diberikan
      if (!userData.role) {
        userData.role = 'member';
      }

      // Hash password
      userData.password = await bcrypt.hash(userData.password, 10);

      // Menambahkan user baru ke Firestore
      await addDoc(collection(firestore, 'users'), userData);
      callback({ status: true, message: 'Register success' });
    }
  } catch (error) {
    console.error(error);
    callback({ status: false, message: 'Error on server side' });
  }
}
