import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'

export default function Public() {
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const loadArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setArticles(data)
            }
        }

        loadArticles()
    }, [])

    const filteredArticles = useMemo(() => {
        return articles.filter((article) =>
            article.title.toLowerCase().includes(search.toLowerCase())
        )
    }, [articles, search])

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return ''

        let videoId = ''

        if (url.includes('v=')) {
            videoId = url.split('v=')[1].split('&')[0]
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1
                    style={{
                        marginBottom: '8px',
                        fontSize: 'clamp(28px, 6vw, 48px)',
                        wordBreak: 'break-word',
                    }}
                >
                    メディア名（Public.jsxで変更可能）
                </h1>

                <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                    メディアの概要（Public.jsxで変更可能）
                </p>

                <div style={{ marginTop: '12px' }}>
                    <Link to="/" style={{ marginRight: '16px' }}>
                        Articles
                    </Link>
                    <Link to="/about">About</Link>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="タイトル検索"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filteredArticles.length === 0 ? (
                <p>記事がありません</p>
            ) : (
                filteredArticles.map((article) => {
                    const embedUrl = getYoutubeEmbedUrl(article.youtube_url)

                    return (
                        <div
                            key={article.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: 16,
                                marginBottom: 16,
                                borderRadius: 8,
                            }}
                        >
                            <h3>{article.title}</h3>

                            {article.thumbnail_url && (
                                <img
                                    src={article.thumbnail_url}
                                    alt={article.title}
                                    style={{
                                        maxWidth: '300px',
                                        display: 'block',
                                        marginBottom: '12px',
                                    }}
                                />
                            )}

                            {embedUrl && (
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={embedUrl}
                                    title={article.title}
                                    frameBorder="0"
                                    allowFullScreen
                                    style={{ marginBottom: '12px' }}
                                />
                            )}

                            <p>{article.content}</p>
                        </div>
                    )
                })
            )}

            <hr style={{ margin: '40px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
                © 2026 SPR Original CMS Project
            </p>
        </div>
    )
}



