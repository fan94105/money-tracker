import { useEffect, useState } from "react";
import "./App.css";
import * as dayjs from "dayjs";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  const url = import.meta.env.VITE_API_URL;

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const parts = name.split(" ");
    const price = parts[0];
    fetch(`${url}/transaction`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name.substring(price.length + 1),
        price,
        datetime,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setName("");
        setDatetime("");
        setDescription("");
      });
  };

  const formatTime = (time) => {
    return dayjs(time).format("YYYY-MM-DD HH:mm");
  };

  const getTransactions = () => {
    return fetch(`${url}/transactions`)
      .then((res) => res.json())
      .then((data) => data);
  };

  useEffect(() => {
    getTransactions().then((data) => {
      setTransactions(data);
    });
  }, [transactions]);

  return (
    <main>
      <h1>${balance}</h1>
      <form onSubmit={handleSubmit}>
        <div className="basic">
          <input
            type="text"
            placeholder="+10 茶葉蛋"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            placeholder="描述..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">新增</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={`price ${transaction.price < 0 ? "red" : "green"}`}
                >
                  {transaction.price}
                </div>
                <div className="datetime">
                  {formatTime(transaction.datetime)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
