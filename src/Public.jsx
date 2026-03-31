import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'
import { Link } from 'react-router-dom'

export default function Public() {
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })

            if (error) {
                console.log(error)
                return
            }

            setArticles(data || [])
        }

        fetchArticles()
    }, [])

    return (
        <div
            className="container"
            style={{
                maxWidth: 'min(90vw, 720px)',
                margin: '0 auto',
                padding: '0 24px',
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                    padding: '16px',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <img
                            src="/logo.png"
                            alt="Musikyun"
                            style={{
                                width: '120px',
                                marginBottom: '12px',
                            }}
                        />
                    </Link>

                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h1
                            style={{
                                marginBottom: '8px',
                                fontSize: 'clamp(24px, 5vw, 36px)',
                                letterSpacing: '0.05em',
                            }}
                        >
                            ミュージキュン
                        </h1>
                    </Link>

                    <p
                        style={{
                            color: '#666',
                            fontSize: '14px',
                        }}
                    >
                        音楽を聞いて心が動く。感動共有メディア
                    </p>

                    <div
                        style={{
                            position: 'relative',
                            marginTop: '24px',
                            textAlign: 'center',
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: '#cc0000',
                                fontWeight: 'bold',
                                marginRight: '16px',
                            }}
                        >
                            Articles
                        </Link>

                        <Link
                            to="/about"
                            style={{
                                textDecoration: 'none',
                                color: '#cc0000',
                                fontWeight: 'bold',
                            }}
                        >
                            About
                        </Link>

                        <a
                            href="https://instagram.com/musikyun"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                            }}
                        >
                            <img
                                src="/insta.png"
                                alt="Instagram"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                }}
                            />
                        </a>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="タイトル検索"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '24px',
                        boxSizing: 'border-box',
                    }}
                />

                {articles
                    .filter((article) =>
                        article.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((article) => {
                        const videoId = article.youtube_url?.split('v=')[1]?.split('&')[0]

                        return (
                         <Link
                           to={`/article/${article.slug}`}
                           style={{ textDecoration: 'none', color: 'inherit' }}
                         >
                                <div
                                    key={article.id}
                                    className='article'
                                    style={{marginTop: '32px', cursor: "pointer", transition: '0.2s'}}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                >
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#999',
                                        marginBottom: '8px',
                                    }}
                                >
                                        {videoId ? (
                                            <img
                                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                alt="thumbnail"
                                                className="thumbnail"
                                            />
                                        ) : (
                                            <img
                                                src="/logo.png"
                                                alt="Musikyun"
                                                className="thumbnail"
                                            />
                                        )}
                                </div>
                            <div style={{flex: 1 }}>
                                <h2 style={{ textAlign: 'left' }}>
                                    <Link
                                        to={`/article/${article.slug}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {article.title.split('\n').map((line, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    fontSize:
                                                        i === 0 ? '20px' :
                                                            i === 3 ? '20px' :
                                                                '14px',
                                                    color:
                                                        (i === 0 || i === 3) ? '#2563eb' :
                                                            (i === 1 || i === 2 || i === 4 || i === 5) ? '#6b85c7' :
                                                                '#666',
                                                    fontWeight: (i === 2 || i === 5) ? 'normal' : 'bold',
                                                    marginBottom: (i === 2 || i === 5) ? '14px' : '4px',
                                                }}
                                            >
                                                {line}
                                            </div>
                                        ))}
                                    </Link>
                                </h2>
                            </div>
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: '#aaa',
                                        marginTop: '4px',
                                        textAlign: 'left',
                                    }}
                                >
                                    {article.created_at &&
                                        new Date(article.created_at).toLocaleDateString('ja-JP')}
                                </p>
                            </div>
                        </Link>
                        )
                    })}
            </div>

            <div
                style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '32px',
                    paddingBottom: '16px',
                }}
            >
                © 2026 Musikyun
            </div>
        </div>
    )
}