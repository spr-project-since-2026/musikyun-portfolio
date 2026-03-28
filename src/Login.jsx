import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
            return
        }

        const userId = data.user.id

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

        if (profileError) {
            console.log(profileError)
            alert('role取得失敗')
            return
        }

        if (profile.role === 'writer') {
            navigate('/writer')
        } else if (profile.role === 'editor') {
            navigate('/editor')
        } else {
            alert('role不明')
        }
    }

    return (
        <div className="container">
            <h2>ログイン</h2>

            <input
                type="email"
                placeholder="メール"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleLogin}>ログイン</button>
        </div>
    )
}