import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, Spin, Alert } from 'antd'
import { getPosts } from '../../slice/PostsSlice'
import Post from '../Post/Post'
import styles from './PostList.module.scss'

export default function PostList() {
  const dispatch = useDispatch()
  const { articles, loading, error, articlesCount, offset, limit } = useSelector((state) => state.posts)
  const { token } = useSelector((state) => state.auth)
  const currentPage = Math.floor(offset / limit) + 1
  useEffect(() => {
    dispatch(getPosts({ offset, limit, token }))
  }, [dispatch, offset, limit, token])

  const handlePageChange = (page) => {
    const newOffset = (page - 1) * limit
    dispatch(getPosts({ offset: newOffset, limit }))
  }

  if (loading) {
    return <Spin size="large" />
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />
  }

  return (
    <div>
      <ul className={styles['post-list']}>
        {articles.map((article) => (
          <li key={article.slug}>
            <Post article={article} />
          </li>
        ))}
      </ul>
      <Pagination
        current={currentPage}
        total={articlesCount}
        onChange={handlePageChange}
        pageSize={limit}
        className={styles.pagination}
        showSizeChanger={false}
      />
    </div>
  )
}