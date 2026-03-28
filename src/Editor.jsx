import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function Editor() {
    const [articles, setArticles] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [currentImageUrl, setCurrentImageUrl] = useState('')
    const [removeImage, setRemoveImage] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const navigate = useNavigate()

    const loadArticles = async () => {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setArticles(data)
        }
    }

    useEffect(() => {
        loadArticles()
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

    const handleEdit = (article) => {
        setTitle(article.title)
        setContent(article.content)
        setYoutubeUrl(article.youtube_url || '')
        setImageFile(null)
        setCurrentImageUrl(article.thumbnail_url || '')
        setRemoveImage(false)
        setEditingId(article.id)
    }

    const handlePublish = async (id) => {
        const { error } = await supabase
            .from('articles')
            .update({ status: 'published' })
            .eq('id', id)

        if (error) {
            alert('公開失敗')
        } else {
            alert('公開しました')
            loadArticles()
        }
    }

    const handleReturn = async (id) => {
        const { error } = await supabase
            .from('articles')
            .update({ status: 'needs_revision' })
            .eq('id', id)

        if (error) {
            alert('差し戻し失敗')
        } else {
            alert('差し戻しました')
            loadArticles()
        }
    }
    const handleCreate = async () => {
        const { data } = await supabase.auth.getUser()
        const user = data.user

        const { error } = await supabase
            .from('articles')
            .insert([
                {
                    title,
                    content,
                    youtube_url: youtubeUrl,
                    status: 'draft',
                    author_id: user.id
                }
            ])

        if (error) {
            alert(error.message)
        } else {
            alert('作成した！')
            resetForm()
            loadArticles()
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
            console.error(error)
            alert(error.message)
        } else {
            alert('更新した！')
            resetForm()
            loadArticles()
        }
    }
    
    const handleClose = async (id) => {
        const { error } = await supabase
            .from('articles')
            .update({ status: 'closed' })
            .eq('id', id)

        if (error) {
            console.error(error)
            alert(error.message)
        } else {
            alert('非公開にした！')
            loadArticles()
        }
    }

    const handleNeedsRevision = async (id) => {
        const { error } = await supabase
            .from('articles')
            .update({ status: 'needs_revision' })
            .eq('id', id)

        if (error) {
            console.error(error)
            alert(error.message)
        } else {
            alert('差し戻しにした！')
            loadArticles()
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
            if (editingId === id) resetForm()
            loadArticles()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <div className="container">
            <h2>編集者画面</h2>

            <button onClick={handleLogout}>ログアウト</button>

            <hr style={{ margin: '24px 0' }} />

            {editingId && (
                <>
            <h3>記事編集</h3>

            <input
                type="text"
                placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br /><br />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        style={{
                            width: '100%',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            padding: '8px'
                        }}
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
                    <img src={currentImageUrl} alt="" style={{ maxWidth: '200px' }} />
                </>
            )}

            <br />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
            />
                </>
            )}

            <br /><br />

            {editingId && (
                <>
                    <label>
                        <input
                            type="checkbox"
                            checked={removeImage}
                            onChange={(e) => setRemoveImage(e.target.checked)}
                        />
                        画像削除
                    </label>

                    <br /><br />

                    <button onClick={editingId === 'new' ? handleCreate : handleUpdate}>
                        保存
                    </button>
                    <button onClick={resetForm}>キャンセル</button>
                </>
            )}
            <br /><br />

            <button onClick={() => {
                resetForm()
                setEditingId('new')
            }}>
                ＋ 新規作成
            </button>
            <button onClick={() => handlePublish(editingId)}>公開</button>

            <h3>記事一覧</h3>

            {articles.map((article) => (
                <div key={article.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
                    <h4>{article.title}</h4>
                    <p>{article.content}</p>

                    {article.youtube_url && <p>YouTube: {article.youtube_url}</p>}
                    {article.thumbnail_url && <img src={article.thumbnail_url} style={{ maxWidth: '200px' }} />}

                    <p>status: {article.status}</p>

                    <button onClick={() => handleEdit(article)}>編集</button>

                    {' '}

                    <button
                        onClick={() =>
                            article.status === 'published'
                                ? handleClose(article.id)
                                : handlePublish(article.id)
                        }
                    >
                        {article.status === 'published' ? '非公開' : '公開'}
                    </button>

                    {' '}

                    <button onClick={() => handleDelete(article.id)}>削除</button>

                    {' '}

                    <button onClick={() => handleNeedsRevision(article.id)}>差し戻し</button>

                </div>
            ))}
        </div>
    )
}