// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "../styles/dashboard.css";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Health",
  "Education",
  "Travel",
  "Rent",
  "Bills",
  "General",
];

export default function Dashboard() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const user = auth.currentUser;

  // 🔹 Load current user's expenses
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const userRef = doc(db, "users", user.uid);
      const expensesRef = collection(userRef, "expenses");
      const snap = await getDocs(expensesRef);
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadData();
  }, [user]);

  // 🔹 Add new expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !user) return;

    const expense = {
      title,
      amount: parseFloat(amount),
      category,
      date,
      createdAt: new Date(),
    };

    const userRef = doc(db, "users", user.uid);
    const expensesRef = collection(userRef, "expenses");

    // create user doc if not exists
    await setDoc(userRef, { email: user.email }, { merge: true });

    const docRef = await addDoc(expensesRef, expense);
    setExpenses((prev) => [...prev, { id: docRef.id, ...expense }]);

    setTitle("");
    setAmount("");
    setDate("");
  };

  // 🔹 Delete Expense
  const deleteExpense = async (id) => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    const expenseRef = doc(db, "users", user.uid, "expenses", id);
    await deleteDoc(expenseRef);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // 🔹 Budget and total calculations
  const totalSpent = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const remaining = budget - totalSpent;

  // 🔹 Logout
  const handleLogout = async () => {
  await signOut(auth);
  localStorage.clear();
  sessionStorage.clear();

  // Force redirect instantly
  window.location.href = "/login";
};


  return (
    <div className="dash-container">
      {/* 🔸 Profile Section */}
      <div className="profile-section">
        <div className="profile-info">
          <h2>Welcome, {user?.email || "Guest"}</h2>
          <p>Your personal budget tracker 💰</p>
        </div>
        <button id="logout-btn" className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1>💸 Expense & Budget Tracker</h1>

      {/* 🔸 Buttons */} 
      <div className="top-bar">
        <button id="budget-btn"
          onClick={() => {
            const val = parseFloat(prompt("Enter your total monthly budget:"));
            if (!isNaN(val)) setBudget(val);
          }}
        >
          Set / Update Budget
        </button>
        <Link to="/reports"><button id="reports-btn">📊 View Reports</button></Link>
      </div>

      {/* 🔸 Budget summary */}
      <div className="budget-box">
        <p><strong>Total Budget:</strong> ${budget.toFixed(2)}</p>
        <p><strong>Spent:</strong> ${totalSpent.toFixed(2)}</p>
        <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>
      </div>

      {/* 🔸 Add Expense Form */}
      <form onSubmit={addExpense} className="expense-form">
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense title"
        />
        <input
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button id="save-btn" type="submit">Add Expense</button>
      </form>

      {/* 🔸 Expense List */}
      <h2>Recent Expenses</h2>
      <ul className="expense-list" id="expense-list">
        {expenses.map((e) => (
          <li key={e.id} className="expense-item">
            <div>
              <strong>{e.title}</strong> – ${e.amount} | {e.category} | {e.date}
            </div>
            <button className="delete-btn" onClick={() => deleteExpense(e.id)}>
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
