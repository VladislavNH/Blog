import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from '../../slice/AuthSlice'

export default function AuthSession({ children }) {
  const dispatch = useDispatch()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(fetchCurrentUser())
    }
  })
  return children
}
