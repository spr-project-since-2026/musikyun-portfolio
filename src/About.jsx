export default function About() {
    return (
        <div className="container" style={{
            maxWidth: 'min(90vw, 720px)',
            margin: '0 auto',
            padding: '0 16px'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                padding: '16px',
                marginBottom: '48px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ marginBottom: '12px' }}>About</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        ミュージキュンについて
                    </p>

                    <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
                        <a href="/">Articles</a>
                        <a href="/about">About</a>
                    </div>
                </div>
                <div style={{ textAlign: 'left', lineHeight: '1.9', color: '#333' }}>
                    <p style={{ textAlign: 'left' }}>
                        ミュージキュンは、音楽の魅力を味わう感動共有メディアです。<br />
                        楽曲レビューや分析を通して、音楽の素晴らしさを日本語と英語で発信しています。
                    </p>
                    <p style={{ textAlign: 'left' }}>
                        本メディアは個人で運営しており、編集部という形式で運用しています。
                    </p>
                </div>
                
                    <div style={{ marginTop: '48px', textAlign: 'left' }}>
                        <h2 style={{ marginBottom: '12px' }}>Contribute</h2>

                    <p style={{ textAlign: 'left', marginBottom: '16px', lineHeight: '1.8' }}>
                        ミュージキュンでは、楽曲レビューの投稿を随時募集しています。<br />
                            あなたの「好き」や「感動」を、ぜひシェアしてください。
                        </p>

                    <p style={{ textAlign: 'left', marginBottom: '16px', lineHeight: '1.8' }}>
                         ※いただいた投稿は編集部にて確認のうえ、一部を記事としてご紹介させていただく場合があります。<br />
                        ※本文は日本語のみでも問題ありません。英語での記述や翻訳ツールの使用も歓迎しています。<br />
                        ※英訳がない場合、必要に応じて編集部で補足させていただく場合があります。<br />
                    </p>

                        <a
                        href="https://forms.gle/5M6GpSCDd2AMJXJi8"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: '8px',
                                color: '#ef4444',
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}
                        >
                            ▶ 投稿はこちら
                        </a>
                    </div>
                    
                
            </div>
        </div>
    )
}