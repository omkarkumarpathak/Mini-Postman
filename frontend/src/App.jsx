import { useEffect, useState } from "react";
import axios, { spread } from "axios";
import "./App.css";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("{}");

  const [response, setResponse] = useState(null);
  const [logs, setLogs] = useState([]);
  const [Error, setError] = useState();

  const sendRequest = async () => {
    if (!url || !method || url.length == 0 || method.length == 0) {
      setError("All fields required");
      return;
    }

    let parsedData = null;
    if (method !== "GET" && method !== "DELETE") {
      try {
        parsedData = JSON.parse(body);
      } catch (error) {
        setResponse("Something wrong in JSON body", error);
        return;
      }
    }

    try {
      const options = {
        method,
        url,
        headers: { "Content-Type": "application/json" },
        ...(parsedData ? { data: parsedData } : {}),
      };

      const res = await axios(options);
      setResponse(res.data);

      // saving the log to backend
      await axios.post("http://localhost:5000/logs", {
        method,
        url,
        requestBody: parsedData,
        responseBody: res.data,
      });

      fetchLogs();
    } catch (err) {
      setResponse(err.message);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get("http://localhost:5000/logs?page=1");
    setLogs(res.data.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mini Postman</h2>
      <div class="input">
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "300px", marginLeft: "10px" }}
        />
        <button onClick={sendRequest}>Send</button>
      </div>
      {(method === "POST" || method === "PUT") && (
        <textarea
          rows="5"
          cols="40"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="JSON Body"
        />
      )}
      <br />

      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>

      <h3>History Logs:</h3>
      <ol type="A">
        {logs.map((log) => (
          <li key={log.id}>
            {log.method} {log.url} - {new Date(log.createdAt).toLocaleString()}
          </li>
        ))}
      </ol>
      <div>{Error && <div>{Error}</div>}</div>
    </div>
  );
}

export default App;
