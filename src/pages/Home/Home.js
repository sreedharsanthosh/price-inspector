import React from "react";
import "./home.css";
import bg from "../../assets/images/bg.svg";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyAk5q_nTnh6v8Sy5BzyRPVOU7QBlD7F7DU",
  authDomain: "pricetracker-81600.firebaseapp.com",
  projectId: "pricetracker-81600",
  storageBucket: "pricetracker-81600.appspot.com",
  messagingSenderId: "237262800330",
  appId: "1:237262800330:web:abbb93e5f306f31a8fbb33",
};

const app = initializeApp(firebaseConfig);

function Home() {
  let navigate = useNavigate();

  const signIn = () => {
    const provider = new GoogleAuthProvider();

    const auth = getAuth(app);

    const db = getFirestore(app);

    signInWithPopup(auth, provider)
      .then(async (res) => {
        const docRef = await doc(db, "users", res.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          navigate("/user", { state: { id: res.user.uid } });
        } else {
          await setDoc(doc(db, "users", res.user.uid), {
            link: [],
          });
          navigate("/user", { state: { id: res.user.uid } });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="home">
        <div className="text">
          <h1>
            Price <br /> Inspector.
          </h1>
          <p>
            A single place to track the price of all your dream products So that
            you never miss out on an offer.
          </p>
          <button className="continue" onClick={signIn}>
            Continue
          </button>
        </div>
        <img className="img" src={bg} alt="illustration of a discount symbol" />
      </div>
    </div>
  );
}

export default Home;
