import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import avatar from '../../assets/avatar.png'
import { likePosts, unLikePost } from '../../slice/PostSlice'
import styles from './Post.module.scss'

export default function Post({ article }) {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  if (!article) return null
  const handleFavoriteClick = () => {
    if (article.favorited) {
      dispatch(unLikePost({ slug: article.slug, token }))
    } else {
      dispatch(likePosts({ slug: article.slug, token }))
    }
  }
  let like = ''
  if (article.favorited) {
    like = 'redLike'
  } else {
    like = 'like'
  }

  return (
    <div className={styles.post}>
      <div className={styles.post__left}>
        <div className={styles.tile}>
          <Link to={`/article/${article.slug}`} className={styles['tile-info']}>
            {article.title}
          </Link>
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
        <p className={styles.description}>{article.description}</p>
      </div>
      <div className={styles.post__right}>
        <div className={styles['user-info']}>
          <div className={styles.nickname}>{article.author.username}</div>
          <div className={styles.data}>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</div>
        </div>
        <img className={styles.profile__picture} src={article.author?.image || avatar} alt={article.author.username} />
      </div>
    </div>
  )
}
