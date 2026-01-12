import { useState } from 'react';
import api from '../api/api';
import './Search.css';

/**
 * AnimeSearch Page
 * 
 * MyAnimeList-style anime search using the API Gateway.
 * All requests go through /api/anime with X-API-Key header.
 */
const AnimeSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await api.get('/api/anime', { params: { q: query } });
            setResults(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search anime');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const getYear = (anime) => {
        if (anime.year) return anime.year;
        if (anime.aired?.from) return new Date(anime.aired.from).getFullYear();
        return 'N/A';
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <h1>🎬 Anime Search</h1>
                <p>Search for anime series, movies, and OVAs</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anime... (e.g., Naruto, One Piece, Attack on Titan)"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="search-error">{error}</div>}

            <div className="search-results">
                {loading && <div className="search-loading">Searching for anime...</div>}

                {!loading && hasSearched && results.length === 0 && (
                    <div className="search-empty">
                        <span className="empty-icon">🔍</span>
                        <p>No anime found for "{query}"</p>
                        <span className="empty-hint">Try a different search term</span>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <div className="results-count">{results.length} results found</div>
                        <div className="results-grid">
                            {results.map((anime) => (
                                <div key={anime.mal_id} className="result-card">
                                    <div className="card-image">
                                        <img
                                            src={anime.images?.jpg?.image_url || '/placeholder.png'}
                                            alt={anime.title}
                                            loading="lazy"
                                        />
                                        {anime.score && (
                                            <div className="card-score">★ {anime.score}</div>
                                        )}
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">{anime.title}</h3>
                                        <div className="card-meta">
                                            <span className="meta-item">{anime.type || 'Unknown'}</span>
                                            <span className="meta-item">{getYear(anime)}</span>
                                            {anime.episodes && (
                                                <span className="meta-item">{anime.episodes} eps</span>
                                            )}
                                        </div>
                                        {anime.status && (
                                            <div className={`card-status status-${anime.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {anime.status}
                                            </div>
                                        )}
                                        <p className="card-synopsis">
                                            {anime.synopsis
                                                ? anime.synopsis.slice(0, 120) + '...'
                                                : 'No synopsis available'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnimeSearch;
