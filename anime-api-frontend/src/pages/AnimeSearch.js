import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchAPI } from '../api/api';
import './Search.css';

/**
 * AnimeSearch Page
 * 
 * MyAnimeList-style anime search with card grid.
 * Clicking a result navigates to anime detail page.
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
            const response = await searchAPI.anime(query);
            setResults(response.data.data || []);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('API access denied. Please check your API key.');
            } else {
                setError(err.response?.data?.message || 'Failed to search anime');
            }
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
            <div className="search-hero">
                <h1>Anime Search</h1>
                <p>Search from thousands of anime series, movies, and OVAs</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anime titles..."
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
                        <p>Searching anime...</p>
                    </div>
                )}

                {!loading && hasSearched && results.length === 0 && !error && (
                    <div className="search-empty">
                        <p>No anime found for "{query}"</p>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <div className="results-header">
                            <span className="results-count">Found {results.length} anime</span>
                        </div>
                        <div className="results-list">
                            {results.map((anime) => (
                                <Link
                                    to={`/anime/${anime.mal_id}`}
                                    key={anime.mal_id}
                                    className="result-item"
                                >
                                    <div className="item-image">
                                        <img
                                            src={anime.images?.jpg?.image_url}
                                            alt={anime.title}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="item-content">
                                        <h3 className="item-title">{anime.title}</h3>
                                        {anime.title_english && anime.title_english !== anime.title && (
                                            <p className="item-title-alt">{anime.title_english}</p>
                                        )}
                                        <div className="item-meta">
                                            <span className="meta-type">{anime.type || 'TV'}</span>
                                            <span className="meta-episodes">
                                                {anime.episodes ? `${anime.episodes} episodes` : 'Unknown episodes'}
                                            </span>
                                            <span className="meta-year">{getYear(anime)}</span>
                                        </div>
                                        <p className="item-synopsis">
                                            {anime.synopsis
                                                ? anime.synopsis.slice(0, 200) + '...'
                                                : 'No synopsis available.'}
                                        </p>
                                    </div>
                                    <div className="item-score">
                                        <div className="score-value">{anime.score || 'N/A'}</div>
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

export default AnimeSearch;
