import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import './AnimeDetail.css';

/**
 * AnimeDetail Page
 * 
 * MyAnimeList-style anime detail page layout.
 * Fetches full anime data from /api/anime/:id
 */
const AnimeDetail = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnimeDetail();
    }, [id]);

    const fetchAnimeDetail = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/anime/${id}`);
            setAnime(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load anime details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="detail-loading">
                <div className="spinner"></div>
                <p>Loading anime details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detail-error">
                <p>{error}</p>
                <Link to="/dashboard/anime" className="back-link">← Back to Search</Link>
            </div>
        );
    }

    if (!anime) return null;

    return (
        <div className="anime-detail">
            {/* Header Banner */}
            <div className="detail-header">
                <Link to="/dashboard/anime" className="back-btn">← Back</Link>
            </div>

            <div className="detail-content">
                {/* Left Column - Poster & Info */}
                <aside className="detail-sidebar">
                    <div className="poster-container">
                        <img
                            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                            alt={anime.title}
                            className="poster-image"
                        />
                    </div>

                    <div className="info-section">
                        <h3>Information</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="label">Type:</span>
                                <span className="value">{anime.type || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Episodes:</span>
                                <span className="value">{anime.episodes || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Status:</span>
                                <span className="value">{anime.status || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Aired:</span>
                                <span className="value">{anime.aired?.string || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Duration:</span>
                                <span className="value">{anime.duration || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Rating:</span>
                                <span className="value">{anime.rating || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Source:</span>
                                <span className="value">{anime.source || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Studios */}
                    {anime.studios?.length > 0 && (
                        <div className="info-section">
                            <h3>Studios</h3>
                            <div className="tags">
                                {anime.studios.map(studio => (
                                    <span key={studio.mal_id} className="tag">{studio.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Genres */}
                    {anime.genres?.length > 0 && (
                        <div className="info-section">
                            <h3>Genres</h3>
                            <div className="tags">
                                {anime.genres.map(genre => (
                                    <span key={genre.mal_id} className="tag">{genre.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Right Column - Main Content */}
                <main className="detail-main">
                    {/* Title Section */}
                    <div className="title-section">
                        <h1 className="anime-title">{anime.title}</h1>
                        {anime.title_english && anime.title_english !== anime.title && (
                            <h2 className="anime-title-english">{anime.title_english}</h2>
                        )}
                        {anime.title_japanese && (
                            <p className="anime-title-japanese">{anime.title_japanese}</p>
                        )}
                    </div>

                    {/* Score Section */}
                    <div className="score-section">
                        <div className="score-box">
                            <div className="score-label">SCORE</div>
                            <div className="score-value">{anime.score || 'N/A'}</div>
                            <div className="score-users">{anime.scored_by?.toLocaleString() || 0} users</div>
                        </div>
                        <div className="stats-box">
                            <div className="stat">
                                <span className="stat-label">Ranked</span>
                                <span className="stat-value">#{anime.rank || 'N/A'}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Popularity</span>
                                <span className="stat-value">#{anime.popularity || 'N/A'}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Members</span>
                                <span className="stat-value">{anime.members?.toLocaleString() || 0}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Favorites</span>
                                <span className="stat-value">{anime.favorites?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Synopsis */}
                    <div className="content-section">
                        <h3>Synopsis</h3>
                        <p className="synopsis">{anime.synopsis || 'No synopsis available.'}</p>
                    </div>

                    {/* Background */}
                    {anime.background && (
                        <div className="content-section">
                            <h3>Background</h3>
                            <p className="background">{anime.background}</p>
                        </div>
                    )}

                    {/* Trailer */}
                    {anime.trailer?.embed_url && (
                        <div className="content-section">
                            <h3>Trailer</h3>
                            <div className="trailer-container">
                                <iframe
                                    src={anime.trailer.embed_url}
                                    title="Trailer"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AnimeDetail;
