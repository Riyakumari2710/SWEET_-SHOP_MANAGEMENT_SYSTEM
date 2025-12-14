import { useEffect, useState } from "react";
import "./App.css";

import gulab from "./assets/gj.jpeg";
import ladoo from "./assets/laado.jpeg";
import kaju from "./assets/kaju.jpeg";
import rash from "./assets/rash.jpeg";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [page, setPage] = useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [userName, setUserName] = useState(localStorage.getItem("name"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));

  const [sweets, setSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  const [msg, setMsg] = useState("");
  const [orderMsg, setOrderMsg] = useState("");

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQty, setNewQty] = useState("");

  const sweetImages = {
    "Gulab Jamun": gulab,
    "Kaju Katli": kaju,
    "Ladoo": ladoo,
    "Rashmalai": rash
  };

  const login = async () => {
    const r = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const d = await r.json();
    if (d.token) {
      const derivedName = d.name || email.split("@")[0];
      localStorage.setItem("token", d.token);
      localStorage.setItem("role", d.role);
      localStorage.setItem("name", derivedName);
      localStorage.setItem("email", email);
      setToken(d.token);
      setRole(d.role);
      setUserName(derivedName);
      setUserEmail(email);
    }
  };

  const register = async () => {
    const r = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput,
        email,
        password
      })
    });
    const d = await r.json();
    if (d.id) {
      setIsRegister(false);
      setNameInput("");
      setEmail("");
      setPassword("");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  const loadSweets = async () => {
    const r = await fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const d = await r.json();
    setSweets(Array.isArray(d) ? d : []);
  };

  useEffect(() => {
    if (token) loadSweets();
  }, [token]);

  const addToCart = (s) => {
    setCart([...cart, s]);
    setMsg(`${s.name} added to cart`);
    setTimeout(() => setMsg(""), 2000);
  };

  const buyNow = () => {
    setCart([]);
    setOrderMsg("Thank you for shopping at 56 BHOG ✨");
    setTimeout(() => setOrderMsg(""), 3000);
  };

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const restock = async (id) => {
    await fetch(`http://localhost:5000/api/sweets/${id}/restock`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadSweets();
  };

  const del = async (id) => {
    await fetch(`http://localhost:5000/api/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadSweets();
  };

  const addSweet = async () => {
    await fetch("http://localhost:5000/api/sweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName,
        price: Number(newPrice),
        quantity: Number(newQty)
      })
    });
    setNewName("");
    setNewPrice("");
    setNewQty("");
    loadSweets();
  };

  if (!token) {
    return (
      <div className="login">
        <h2>{isRegister ? "Register at 56 BHOG" : "56 BHOG Login"}</h2>

        {isRegister && (
          <input
            placeholder="Full Name"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {isRegister ? (
          <button onClick={register}>Register</button>
        ) : (
          <button onClick={login}>Login</button>
        )}

        <p
          style={{ marginTop: "15px", cursor: "pointer", color: "#7a0c2e" }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <aside>
        <h1>56 BHOG</h1>
        <p onClick={() => setPage("dashboard")}>Dashboard</p>
        <p onClick={() => setPage("cart")}>My Cart</p>
        <p onClick={() => setPage("profile")}>My Profile</p>
        <p onClick={logout}>Logout</p>
      </aside>

      <main>
        {msg && <div className="toast">{msg}</div>}
        {orderMsg && <div className="popup">{orderMsg}</div>}

        {page === "dashboard" && (
          <>
            <div className="top">
              <input
                placeholder="Search sweets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="banner"></div>

            {role === "admin" && (
              <div className="box">
                <h2>Add Sweet</h2>
                <input placeholder="Sweet Name" value={newName} onChange={e => setNewName(e.target.value)} />
                <input placeholder="Price" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                <input placeholder="Quantity" value={newQty} onChange={e => setNewQty(e.target.value)} />
                <button onClick={addSweet}>Add Sweet</button>
              </div>
            )}

            <div className="grid">
              {sweets
                .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
                .map(s => (
                  <div className="card" key={s.id}>
                    <img src={sweetImages[s.name] || gulab} alt="" />
                    <h3>{s.name}</h3>
                    <p>₹{s.price}</p>
                    <span>Stock: {s.quantity}</span>

                    {role === "admin" ? (
                      <>
                        <button onClick={() => restock(s.id)}>Restock</button>
                        <button onClick={() => del(s.id)}>Delete</button>
                      </>
                    ) : (
                      <button onClick={() => addToCart(s)}>Add to Cart</button>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {page === "cart" && (
          <div className="box cart">
            <h2>Your Sweet Cart</h2>
            {cart.length === 0 && <p>No sweets added yet</p>}
            {cart.map((c, i) => (
              <div className="cart-item" key={i}>
                <img src={sweetImages[c.name] || gulab} alt="" />
                <div>
                  <div className="cart-name">{c.name}</div>
                  <div className="cart-price">₹{c.price}</div>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <>
                <div className="cart-total">
                  Total Amount: ₹{totalAmount}
                </div>
                <button className="buy premium" onClick={buyNow}>Buy Now</button>
              </>
            )}
          </div>
        )}

        {page === "profile" && (
          <div className="box profile">
            <h2>Hello {userName} 👋</h2>
            <p>Welcome to 56 BHOG</p>
            <p><b>Name:</b> {userName}</p>
            <p><b>Email:</b> {userEmail}</p>
            <p><b>Role:</b> {role}</p>
          </div>
        )}
      </main>
    </div>
  );
}
