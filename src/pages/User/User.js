import "./User.css";
import { useLocation } from "react-router-dom";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function User() {
  const app = initializeApp({
    apiKey: "AIzaSyAk5q_nTnh6v8Sy5BzyRPVOU7QBlD7F7DU",
    authDomain: "pricetracker-81600.firebaseapp.com",
    projectId: "pricetracker-81600",
    storageBucket: "pricetracker-81600.appspot.com",
    messagingSenderId: "237262800330",
    appId: "1:237262800330:web:abbb93e5f306f31a8fbb33",
  });
  const location = useLocation();
  const db = getFirestore(app);

  const [link, setLink] = useState("");
  const [site, setSite] = useState("");
  const [document, setDocument] = useState("");

  useEffect(() => {
    const asyncFun = async () => {
      const docRef = doc(db, "users", location.state.id);
      const docSnap = await getDoc(docRef);
      setDocument(docSnap.data());
    };
    asyncFun();
  }, [db, location.state.id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", location.state.id);
    const setData = (site) => {
      axios
        .post(`https://priceinspector.herokuapp.com/${site}`, { url: link })
        .then(async (res) => {
          const newLink = {
            title: res.data.title,
            price: res.data.price,
            img: res.data.img,
            site: site,
            link: link,
          };
          updateDoc(docRef, {
            link: arrayUnion(newLink),
          });
          const newDocRef = doc(db, "users", location.state.id);
          const docSnap = await getDoc(newDocRef);
          setDocument(docSnap.data());
        })
        .catch((err) => console.log(err));
    };
    //eslint-disable-next-line
    switch (site) {
      case "Amazon":
        setData("amazon");
        break;
      case "Flipkart":
        setData("flipkart");
        break;
      case "Snapdeal":
        setData("snapdeal");
        break;
      case "Myntra":
        setData("myntra");
        break;
    }
  };

  return (
    <div className="main">
      <h1>Products that you're currently keeping track of:</h1>
      <div className="container">
        {document
          ? document.link.map((link, index) => (
              <div className="card" key={index}>
                <Link
                  to={link.link}
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <img src={link.img} alt="product" />
                </Link>
                <h1>{link.title}</h1>
                <h3>{link.price}</h3>
                <h5 style={{ fontWeight: "lighter" }}>from {link.site}</h5>
              </div>
            ))
          : null}
        <div className="card-form">
          <form onSubmit={handleFormSubmit}>
            <h1>New Product</h1>
            <label>
              Link:
              <input
                type="text"
                htmlFor="link"
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </label>
            <label htmlFor="site">
              Site:
              <select
                name="site"
                id="site"
                onChange={(e) => {
                  setSite(e.target.value);
                }}
              >
                <option value="select a site" defaultValue={true}>
                  Select a site:{" "}
                </option>
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Snapdeal">Snapdeal</option>
              </select>
            </label>
            <button className="submit">New</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default User;
