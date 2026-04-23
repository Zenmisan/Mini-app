import { useState } from 'react';
import axios from 'axios';
import './App.css';
import { WeatherResponse } from './types/weather';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRagContext, setShowRagContext] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3001/api/weather?city=${city}`);
      setWeather(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="app-container">
      <header>
        <h1>Semantic Weather</h1>
        <p>A RAG-ready weather application</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city name (e.g. London, Tokyo)..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <>
          <div className="weather-card">
            <div className="current-weather">
              <div>
                <h2>{weather.raw.city}</h2>
                <p className="condition-text">{weather.raw.condition}</p>
              </div>
              <p className="temp-main">{Math.round(weather.raw.temperature)}°C</p>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.raw.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.raw.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          <h3>5-Day Forecast</h3>
          <div className="forecast-container">
            {weather.raw.forecast.map((day, i) => (
              <div key={i} className="forecast-item">
                <p style={{ fontWeight: 'bold' }}>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p>{day.condition}</p>
                <p>{Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <button 
              className="rag-toggle-btn"
              onClick={() => setShowRagContext(!showRagContext)}
            >
              {showRagContext ? 'Hide RAG Context' : 'Show RAG Context (Developer Mode)'}
            </button>

            {showRagContext && (
              <div className="rag-panel">
                <div className="rag-header">
                  <strong>Semantic Context for RAG Indexing</strong>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    This JSON object is optimized for LLM ingestion.
                  </p>
                </div>
                <pre>{JSON.stringify(weather.semanticContext, null, 2)}</pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
