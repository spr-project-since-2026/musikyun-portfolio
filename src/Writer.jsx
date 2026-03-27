import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function Writer() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [currentImageUrl, setCurrentImageUrl] = useState('')
    const [removeImage, setRemoveImage] = useState(false)
    const [articles, setArticles] = useState([])
    const [editingId, setEditingId] = useState(null)
    const navigate = useNavigate()

    const loadMyArticles = async () => {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData.user
        if (!user) return

        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setArticles(data)
        }
    }

    useEffect(() => {
        loadMyArticles()
    }, [])

    const resetForm = () => {
        setTitle('')
        setContent('')
        setYoutubeUrl('')
        setImageFile(null)
        setCurrentImageUrl('')
        setRemoveImage(false)
        setEditingId(null)
    }

    const uploadImage = async () => {
        if (!imageFile) return ''

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const filePath = `thumbnails/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(filePath, imageFile)

        if (uploadError) {
            console.error('UPLOAD ERROR:', uploadError)
            alert(JSON.stringify(uploadError))
            throw uploadError
        }

        const { data } = supabase.storage
            .from('article-images')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const handlePost = async () => {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData.user

        let imageUrl = ''
        try {
            imageUrl = await uploadImage()
        } catch (e) {
            alert('画像アップロード失敗')
            return
        }

        const { error } = await supabase.from('articles').insert([
            {
                title,
                content,
                youtube_url: youtubeUrl,
                author_id: user.id,
                status: 'draft',
                thumbnail_url: imageUrl,
            },
        ])

        if (error) {
            alert('公開依頼に失敗')
            console.error(error)
        } else {
            alert('公開依頼を送りました')
            resetForm()
            loadMyArticles()
        }
    }

    const handleUpdate = async () => {
        let updateData = {
            title,
            content,
            youtube_url: youtubeUrl,
        }

        if (removeImage) {
            updateData.thumbnail_url = ''
        } else if (imageFile) {
            try {
                const imageUrl = await uploadImage()
                updateData.thumbnail_url = imageUrl
            } catch (e) {
                alert('画像アップロード失敗')
                return
            }
        } else {
            updateData.thumbnail_url = currentImageUrl
        }

        const { error } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', editingId)

        if (error) {
            alert('更新失敗')
            console.error(error)
        } else {
            alert('更新成功')
            resetForm()
            loadMyArticles()
        }
    }
    const saveArticle = async (status) => {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData.user
        if (!user) return

        const { error } = await supabase.from('articles').insert([
            {
                title,
                content,
                youtube_url: youtubeUrl,
                author_id: user.id,
                status: status,
            },
        ])

        if (error) {
            console.error(error)
            alert(error.message)
        } else {
            alert('保存しました')
            setTitle('')
            setContent('')
            setYoutubeUrl('')
            loadMyArticles()
        }
    }
    const handleDelete = async (id) => {
        const ok = window.confirm('この記事を削除しますか？')
        if (!ok) return

        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(error)
            alert(error.message)
        } else {
            alert('削除しました')
            if (editingId === id) {
                resetForm()
            }
            loadMyArticles()
        }
    }

    const handleEdit = (article) => {
        setTitle(article.title)
        setContent(article.content)
        setYoutubeUrl(article.youtube_url || '')
        setImageFile(null)
        setCurrentImageUrl(article.thumbnail_url || '')
        setRemoveImage(false)
        setEditingId(article.id)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>ライター画面</h2>

            <button onClick={handleLogout}>ログアウト</button>

            <hr style={{ margin: '24px 0' }} />

            <h3>記事編集</h3>

            <input
                type="text"
                placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br /><br />

            <textarea
                placeholder="本文"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <br /><br />

            {currentImageUrl && !removeImage && (
                <>
                    <p>現在の画像</p>
                    <img
                        src={currentImageUrl}
                        alt="current"
                        style={{ maxWidth: '200px', display: 'block', marginBottom: '12px' }}
                    />
                </>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
            />

            <br /><br />

            {editingId && (
                <>
                    <label>
                        <input
                            type="checkbox"
                            checked={removeImage}
                            onChange={(e) => setRemoveImage(e.target.checked)}
                        />
                        画像を削除する
                    </label>
                    <br /><br />
                </>
            )}

            <>
                <button onClick={() => saveArticle('draft')}>
                    下書き保存
                </button>

                <button onClick={() => saveArticle('in_review')}>
                    公開依頼
                </button>

                {editingId && (
                    <button onClick={resetForm}>
                        キャンセル
                    </button>
                )}
            </>

            <hr style={{ margin: '24px 0' }} />

            <h3>記事一覧</h3>

            {articles.length === 0 ? (
                <p>まだ記事がありません</p>
            ) : (
                articles.map((article) => (
                    <div
                        key={article.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: 12,
                            marginBottom: 12,
                            borderRadius: 8,
                        }}
                    >
                        <strong>{article.title}</strong>
                        <p>{article.content}</p>
                        {article.youtube_url && <p>YouTube: {article.youtube_url}</p>}

                        {article.thumbnail_url && (
                            <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                style={{ maxWidth: '200px', display: 'block', marginBottom: '12px' }}
                            />
                        )}

                        <p>status: {article.status}</p>

                        {(article.status === 'draft' || article.status === 'needs_revision') && (
                            <>
                                <button onClick={() => handleEdit(article)}>編集</button>

                                {article.status === 'draft' && (
                                    <button onClick={() => handleDelete(article.id)}>削除</button>
                                )}
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}