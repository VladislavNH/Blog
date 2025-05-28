import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import { Popconfirm, Spin, Alert } from 'antd'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { fetchArticle, removeArticle, likePost, unLikePost } from '../../slice/OpenPostSlice'
import avatar from '../../assets/avatar.png'
import styles from './PostOpen.module.scss'

export default function PostOpen() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: article, loading, error, deleting } = useSelector((state) => state.article)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchArticle(slug))
  }, [dispatch, slug])

  const handleDelete = async () => {
    try {
      await dispatch(removeArticle(slug))
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const handleFavoriteClick = () => {
    if (article.favorited) {
      dispatch(unLikePost(article.slug))
    } else {
      dispatch(likePost(article.slug))
    }
  }

  const handleEdit = () => {
    navigate(`/article/${slug}/edit`)
  }
  if (!article) return null
  const isAuthor = isAuthenticated && user.username === article.author.username

  let like = ''
  if (article.favorited) {
    like = 'redLike'
  } else {
    like = 'like'
  }

  if (loading) {
    return <Spin size="large" />
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />
  }

  return (
    <div className={styles['post-open']}>
      <div className={styles.info}>
        <div className={styles['info-left']}>
          <div className={styles.title}>
            <h1 className={styles['title-info']}>{article.title}</h1>
            <button type="button" className={styles[like]} onClick={handleFavoriteClick}>
              {article.favoritesCount}
            </button>
          </div>
          <div className={styles.tags}>
            {article.tagList?.map((tag) => (
              <div key={nanoid()} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
          <p className={styles['short-description']}>{article.description}</p>
        </div>
        <div className={styles['info-right']}>
          <div className={styles.user}>
            <div className={styles['user-info']}>
              <div className={styles.nickname}>{article.author.username}</div>
              <div className={styles.data}>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</div>
            </div>
            <img className={styles.profile__picture} src={article.author.image || avatar} alt="avatar" />
          </div>
          {isAuthor && (
            <div className={styles.button}>
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                okText="Yes"
                cancelText="No"
                placement="rightTop"
                onConfirm={handleDelete}
                disabled={deleting}
              >
                <button type="button" className={styles['delete-button']}>
                  Delete
                </button>
              </Popconfirm>
              <button type="button" className={styles['edit-button']} onClick={handleEdit}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
      <p className={styles.text}>{article.body}</p>
    </div>
  )
}
