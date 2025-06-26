import { useState } from "react";

function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5174/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult("AI Reply: " + data.response_text);
      } else {
        setResult("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setResult("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }

    try {
      const response = await fetch("http://localhost:5174/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setResult("Error: " + errorText);
      } else {
        const data = await response.json();
        setResult(data.result?.response_text || "No reply from AI.");
      }
    } catch (err: any) {
      setResult("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          className="input-box"
          placeholder="Type your diary entry here..."
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="submit-btn"
          type="submit"
          disabled={loading || !input.trim()}
        >
          {loading ? "Thinking..." : "Get AI Reply"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <strong>{result}</strong>
        </div>
      )}
    </div>
  );
}

export default Home;
