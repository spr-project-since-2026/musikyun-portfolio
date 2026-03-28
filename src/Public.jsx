import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Link } from 'react-router-dom'
import './App.css'

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
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1
                    style={{
                        marginBottom: '8px',
                        fontSize: 'clamp(28px, 6vw, 48px)',
                        wordBreak: 'break-word',
                    }}
                >
                    ミュージキュン
                </h1>

                <p
                    style={{
                        color: '#666',
                        fontSize: '14px',
                        marginBottom: '16px',
                    }}
                >
                    音楽を聞いて心が動く。感動共有メディア
                </p>
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <a href="/">Articles</a>
                    <a href="/about">About</a>
                </div>
                <input
                    type="text"
                    placeholder="タイトル検索"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {articles
                    .filter((article) =>
                        article.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((article) => (
                    <div key={article.id} style={{ marginTop: '32px' }}>
                        <h2>{article.title}</h2>
                        <p>{article.content}</p>
                        {article.youtube_url && (
                            <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${article.youtube_url.split("v=")[1]?.split("&")[0]}`}
                                title="YouTube video"
                                frameBorder="0"
                                allowFullScreen
                            />
                        )}
                    </div>
                ))}



            </div>


        </div>
    )
}