import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './supabase'

export default function ProtectedRoute({ children, allowedRole }) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: userData } = await supabase.auth.getUser()
            const currentUser = userData.user

            if (!currentUser) {
                setUser(null)
                setRole(null)
                setLoading(false)
                return
            }

            setUser(currentUser)

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentUser.id)
                .single()

            if (error) {
                console.error(error)
                setRole(null)
            } else {
                setRole(profile.role)
            }

            setLoading(false)
        }

        checkUser()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (role !== allowedRole) {
        return <Navigate to="/" replace />
    }

    return children
}