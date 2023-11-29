import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3002/status")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No user data</p>;

  return (
    <div>
      <h1>User Data</h1>
      <ul>
        {data.map((value, index) => (
          <li key={index}>
            {value.id} : {value.status}
          </li>
        ))}
      </ul>
      <a href="http://localhost:3002/status">Link</a>
    </div>
  );
}
