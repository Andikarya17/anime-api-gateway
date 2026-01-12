import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchAPI } from '../api/api';
import './Search.css';

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
            const response = await searchAPI.manga(query);
            setResults(response.data.data || []);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('API access denied. Please check your API key.');
            } else {
                setError(err.response?.data?.message || 'Failed to search manga');
            }
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
            <div className="search-hero">
                <h1>Manga Search</h1>
                <p>Search from thousands of manga, manhwa, and light novels</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search manga titles..."
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="search-error">{error}</div>}

            <div className="search-results">
                {loading && (
                    <div className="search-loading">
                        <div className="spinner"></div>
                        <p>Searching manga...</p>
                    </div>
                )}

                {!loading && hasSearched && results.length === 0 && !error && (
                    <div className="search-empty">
                        <p>No manga found for "{query}"</p>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <div className="results-header">
                            <span className="results-count">Found {results.length} manga</span>
                        </div>
                        <div className="results-list">
                            {results.map((manga) => (
                                <Link
                                    key={manga.mal_id}
                                    to={`/manga/${manga.mal_id}`}
                                    className="result-item"
                                >
                                    <div className="item-image">
                                        <img
                                            src={manga.images?.jpg?.image_url}
                                            alt={manga.title}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="item-content">
                                        <h3 className="item-title">{manga.title}</h3>
                                        {manga.title_english && manga.title_english !== manga.title && (
                                            <p className="item-title-alt">{manga.title_english}</p>
                                        )}
                                        <div className="item-meta">
                                            <span className="meta-type">{manga.type || 'Manga'}</span>
                                            <span className="meta-episodes">
                                                {manga.chapters ? `${manga.chapters} chapters` : 'Unknown chapters'}
                                            </span>
                                            <span className="meta-year">{getYear(manga)}</span>
                                        </div>
                                        <p className="item-synopsis">
                                            {manga.synopsis
                                                ? manga.synopsis.slice(0, 200) + '...'
                                                : 'No synopsis available.'}
                                        </p>
                                    </div>
                                    <div className="item-score">
                                        <div className="score-value">{manga.score || 'N/A'}</div>
                                        <div className="score-label">Score</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MangaSearch;
