import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import './MangaDetail.css';

const MangaDetail = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMangaDetail();
    }, [id]);

    const fetchMangaDetail = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/manga/${id}`);
            setManga(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load manga details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="manga-detail">
                <div className="detail-loading">
                    <div className="spinner"></div>
                    <p>Loading manga details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manga-detail">
                <div className="detail-error">
                    <p>{error}</p>
                    <Link to="/dashboard/manga" className="back-link">← Back to Search</Link>
                </div>
            </div>
        );
    }

    if (!manga) return null;

    return (
        <div className="manga-detail">
            <div className="detail-header">
                <Link to="/dashboard/manga" className="back-btn">← Back</Link>
            </div>

            <div className="detail-content">
                <aside className="detail-sidebar">
                    <div className="poster-container">
                        <img
                            src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url}
                            alt={manga.title}
                            className="poster-image"
                        />
                    </div>

                    <div className="info-section">
                        <h3>Information</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="label">Type:</span>
                                <span className="value">{manga.type || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Chapters:</span>
                                <span className="value">{manga.chapters || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Volumes:</span>
                                <span className="value">{manga.volumes || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Status:</span>
                                <span className="value">{manga.status || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Published:</span>
                                <span className="value">{manga.published?.string || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {manga.authors?.length > 0 && (
                        <div className="info-section">
                            <h3>Authors</h3>
                            <div className="tags">
                                {manga.authors.map(author => (
                                    <span key={author.mal_id} className="tag">{author.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {manga.serializations?.length > 0 && (
                        <div className="info-section">
                            <h3>Serialization</h3>
                            <div className="tags">
                                {manga.serializations.map(serial => (
                                    <span key={serial.mal_id} className="tag">{serial.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {manga.genres?.length > 0 && (
                        <div className="info-section">
                            <h3>Genres</h3>
                            <div className="tags">
                                {manga.genres.map(genre => (
                                    <span key={genre.mal_id} className="tag">{genre.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {manga.themes?.length > 0 && (
                        <div className="info-section">
                            <h3>Themes</h3>
                            <div className="tags">
                                {manga.themes.map(theme => (
                                    <span key={theme.mal_id} className="tag">{theme.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <main className="detail-main">
                    <div className="title-section">
                        <h1 className="manga-title">{manga.title}</h1>
                        {manga.title_english && manga.title_english !== manga.title && (
                            <h2 className="manga-title-english">{manga.title_english}</h2>
                        )}
                        {manga.title_japanese && (
                            <p className="manga-title-japanese">{manga.title_japanese}</p>
                        )}
                    </div>

                    <div className="score-section">
                        <div className="score-box">
                            <div className="score-label">SCORE</div>
                            <div className="score-value">{manga.score || 'N/A'}</div>
                            <div className="score-users">{manga.scored_by?.toLocaleString() || 0} users</div>
                        </div>
                        <div className="stats-box">
                            <div className="stat">
                                <span className="stat-label">Ranked</span>
                                <span className="stat-value">#{manga.rank || 'N/A'}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Popularity</span>
                                <span className="stat-value">#{manga.popularity || 'N/A'}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Members</span>
                                <span className="stat-value">{manga.members?.toLocaleString() || 0}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Favorites</span>
                                <span className="stat-value">{manga.favorites?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="content-section">
                        <h3>Synopsis</h3>
                        <p className="synopsis">{manga.synopsis || 'No synopsis available.'}</p>
                    </div>

                    {manga.background && (
                        <div className="content-section">
                            <h3>Background</h3>
                            <p className="background">{manga.background}</p>
                        </div>
                    )}

                    {manga.relations?.length > 0 && (
                        <div className="content-section">
                            <h3>Related</h3>
                            <div className="relations-list">
                                {manga.relations.map((relation, index) => (
                                    <div key={index} className="relation-item">
                                        <span className="relation-type">{relation.relation}:</span>
                                        <span className="relation-entries">
                                            {relation.entry.map(e => e.name).join(', ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MangaDetail;
