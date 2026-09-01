import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from './supabase'

export default function ArticleDetail() {
    const { slug } = useParams()
    const [article, setArticle] = useState(null)

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .single()

            if (error) {
                console.log(error)
                return
            }

            setArticle(data)
        }

        fetchArticle()
    }, [slug])

    if (!article) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>読み込み中...</div>
    }

    return (
        <div
            className="container"
            style={{
                maxWidth: 'min(90vw, 720px)',
                margin: '0 auto',
                padding: '0 24px'
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                    padding: '16px',
                    marginBottom: '48px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1
                        style={{
                            marginBottom: '8px',
                            fontSize: 'clamp(28px, 6vw, 48px)',
                            wordBreak: 'break-word'
                        }}
                    >
                        ミュージキュン
                    </h1>

                    <p
                        style={{
                            color: '#666',
                            fontSize: '14px',
                            marginBottom: '16px'
                        }}
                    >
                        音楽を聞いて心が動く。感動共有メディア
                    </p>

                    <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
                        <Link to="/">Articles</Link>
                        <Link to="/about" style={{ marginLeft: '16px' }}>About</Link>
                    </div>
                </div>

                <h2 style={{ textAlign: 'left' }}>
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
                                marginBottom: (i === 2 || i === 5) ? '14px' : '4px'
                            }}
                        >
                            {line}
                        </div>
                    ))}
                </h2>

                {article.youtube_url && (
                    <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${article.youtube_url.split('v=')[1]?.split('&')[0]}`}
                        title="YouTube video"
                        frameBorder="0"
                        allowFullScreen
                    />
                )}


                <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px', textAlign: 'left' }}>
                    {article.created_at && new Date(article.created_at).toLocaleDateString('ja-JP')}
                </p>

                {article.content.split('\n\n').map((para, i) => (
                    <p
                        key={i}
                        style={{ marginBottom: '16px', textAlign: 'left', lineHeight: '1.9' }}
                    >
                        {para}
                    </p>
                ))}

                <div style={{ marginTop: '32px' }}>
                    <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
                        ← Articles に戻る
                    </Link>
                </div>
            </div>
        </div>
    )
}