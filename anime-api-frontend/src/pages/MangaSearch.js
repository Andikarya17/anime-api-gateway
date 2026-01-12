import { useState } from 'react';
import api from '../api/api';
import './Search.css';

/**
 * MangaSearch Page
 * 
 * MyAnimeList-style manga search using the API Gateway.
 * All requests go through /api/manga with X-API-Key header.
 */
const MangaSearch = () => {
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
            const response = await api.get('/api/manga', { params: { q: query } });
            setResults(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search manga');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const getYear = (manga) => {
        if (manga.published?.from) return new Date(manga.published.from).getFullYear();
        return 'N/A';
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <h1>📚 Manga Search</h1>
                <p>Search for manga, manhwa, and light novels</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search manga... (e.g., One Piece, Berserk, Chainsaw Man)"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="search-error">{error}</div>}

            <div className="search-results">
                {loading && <div className="search-loading">Searching for manga...</div>}

                {!loading && hasSearched && results.length === 0 && (
                    <div className="search-empty">
                        <span className="empty-icon">🔍</span>
                        <p>No manga found for "{query}"</p>
                        <span className="empty-hint">Try a different search term</span>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <div className="results-count">{results.length} results found</div>
                        <div className="results-grid">
                            {results.map((manga) => (
                                <div key={manga.mal_id} className="result-card">
                                    <div className="card-image">
                                        <img
                                            src={manga.images?.jpg?.image_url || '/placeholder.png'}
                                            alt={manga.title}
                                            loading="lazy"
                                        />
                                        {manga.score && (
                                            <div className="card-score">★ {manga.score}</div>
                                        )}
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">{manga.title}</h3>
                                        <div className="card-meta">
                                            <span className="meta-item">{manga.type || 'Unknown'}</span>
                                            <span className="meta-item">{getYear(manga)}</span>
                                            {manga.chapters && (
                                                <span className="meta-item">{manga.chapters} ch</span>
                                            )}
                                            {manga.volumes && (
                                                <span className="meta-item">{manga.volumes} vol</span>
                                            )}
                                        </div>
                                        {manga.status && (
                                            <div className={`card-status status-${manga.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {manga.status}
                                            </div>
                                        )}
                                        <p className="card-synopsis">
                                            {manga.synopsis
                                                ? manga.synopsis.slice(0, 120) + '...'
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

export default MangaSearch;
