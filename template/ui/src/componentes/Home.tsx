import { useState } from "react";

function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setTimeout(() => {
      setResult("AI Reply: " + input);
      setLoading(false);
    }, 900);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setResult("");
      await fetch(import.meta.env.VITE_API_URL + "");
    };
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
