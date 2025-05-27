import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setFormData, resetForm, submitArticle } from '../../features/PostFormSlice'
import styles from './CreateNewArticle.module.scss'

export default function CreateNewArticle() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: existingArticle } = useSelector((state) => state.article)
  const { formData } = useSelector((state) => state.postForm)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [tags, setTags] = useState([''])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (slug && existingArticle) {
      dispatch(
        setFormData({
          title: existingArticle.title || '',
          description: existingArticle.description || '',
          body: existingArticle.body || '',
          tagList: existingArticle.tagList || [],
        })
      )
      setTags(existingArticle.tagList.length > 0 ? [...existingArticle.tagList, ''] : [''])
    }
    return () => dispatch(resetForm())
  }, [dispatch, slug, existingArticle])

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(setFormData({ [name]: value }))
  }

  const handleTagChange = (index, value) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }

  const handleAddTag = () => {
    if (tags[tags.length - 1].trim() !== '') {
      setTags([...tags, ''])
    }
  }

  const handleDeleteTag = (index) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index)
      setTags(newTags)
    } else {
      setTags([''])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nonEmptyTags = tags.filter((tag) => tag.trim() !== '')
    dispatch(setFormData({ tagList: nonEmptyTags }))

    dispatch(
      submitArticle({
        articleData: { ...formData, tagList: nonEmptyTags },
        slug,
      })
    ).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        navigate('/')
      }
    })
  }

  return (
    <form className={styles['create-new-article']}>
      <h1 className={styles.title}>{slug ? 'Edit Article' : 'Create new article'}</h1>
      <label htmlFor="title-input" className={styles['title-create']}>
        Title
        <input
          id="title-input"
          type="text"
          placeholder="Title"
          name="title"
          className={styles['title-input']}
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="short-description" className={styles['create-short-description']}>
        Short description
        <input
          id="short-description"
          type="text"
          name="description"
          placeholder="Short description"
          className={styles['short-description']}
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="text" className={styles['text-create']}>
        Text
        <textarea
          id="text"
          placeholder="Text"
          name="body"
          className={styles.text}
          value={formData.body}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="tags" className={styles['create-tags']}>
        Tags
        <div className={styles['tags-container']}>
          {tags.map((tag, index) => (
            <div key={index} className={styles['tags-main']}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                className={styles.tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
              {tags.length > 1 && (
                <button type="button" className={styles['delete-tag']} onClick={() => handleDeleteTag(index)}>
                  Delete
                </button>
              )}
              {index === tags.length - 1 && (
                <button
                  type="button"
                  className={styles['create-tag']}
                  onClick={handleAddTag}
                  disabled={tag.trim() === ''}
                >
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>
      </label>

      <button type="submit" className={styles['send-button']} onClick={handleSubmit}>
        Send
      </button>
    </form>
  )
}