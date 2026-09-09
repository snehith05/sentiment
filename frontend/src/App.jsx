import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [currentResult, setCurrentResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeSentiment = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      
      setCurrentResult(data);
      setHistory(prev => [data, ...prev]);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to connect to the AI model.");
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>Sentiment Analyzer</h1>
      <textarea 
        placeholder="Type a review or sentence here..." 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button 
        onClick={analyzeSentiment} 
        disabled={loading}
        className={loading ? 'loading-pulse' : ''}
      >
        {loading ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>

      {error && <p className="error">{error}</p>}

      {currentResult && (
        <div className={`result-box ${currentResult.label === 'POSITIVE' ? 'positive' : 'negative'}`}>
          <h2>{currentResult.label}</h2>
          <p>Confidence: {(currentResult.score * 100).toFixed(2)}%</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>Session History</h3>
          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <p className="history-text">"{item.text}"</p>
                <span className={`history-badge ${item.label === 'POSITIVE' ? 'text-pos' : 'text-neg'}`}>
                  {item.label} ({(item.score * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
