import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { Spin, Alert } from 'antd'

import { setFormData, resetForm, submitArticle } from '../../slice/PostFormSlice'
import { getArticleBySlug, clearArticle } from '../../slice/ArticleSlice'

import styles from './CreateNewArticle.module.scss'

export default function CreateNewArticle() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, isInitialized, isAuthenticated } = useSelector((state) => state.auth)

  const { data: existingArticle, loading: articleLoading, error: articleError } = useSelector((state) => state.article)

  const { formData } = useSelector((state) => state.postForm)

  const [tags, setTags] = useState(() => [{ id: uuidv4(), value: '' }])
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (slug && token) {
      dispatch(getArticleBySlug({ slug, token }))
    }
  }, [slug, token, dispatch])

  useEffect(() => {
    if (existingArticle) {
      dispatch(
        setFormData({
          title: existingArticle.title || '',
          description: existingArticle.description || '',
          body: existingArticle.body || '',
          tagList: existingArticle.tagList || [],
        })
      )

      setTags(
        existingArticle.tagList.length > 0
          ? [...existingArticle.tagList.map((t) => ({ id: uuidv4(), value: t })), { id: uuidv4(), value: '' }]
          : [{ id: uuidv4(), value: '' }]
      )
    }
  }, [existingArticle, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetForm())
      dispatch(clearArticle())
    }
  }, [dispatch])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/')
    }
  }, [isInitialized, isAuthenticated, navigate])

  if (slug && articleLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" />
      </div>
    )
  }

  if (slug && articleError) {
    return (
      <div className={styles.errorWrapper}>
        <Alert
          message="Ошибка загрузки статьи"
          description="Возможно, такой статьи не существует, либо сервер вернул ошибку."
          type="error"
          showIcon
        />
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(setFormData({ [name]: value }))
  }

  const handleTagChange = (index, value) => {
    setTags((prev) => prev.map((tag, i) => (i === index ? { ...tag, value } : tag)))
  }

  const handleAddTag = () => {
    const lastTag = tags[tags.length - 1]
    if (lastTag.value.trim() !== '') {
      setTags((prev) => [...prev, { id: uuidv4(), value: '' }])
    }
  }

  const handleDeleteTag = (index) => {
    if (tags.length > 1) {
      setTags((prev) => prev.filter((_, i) => i !== index))
    } else {
      setTags([{ id: uuidv4(), value: '' }])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    if (!formData.title.trim()) {
      setValidationError('Заголовок не может быть пустым или состоять только из пробелов.')
      return
    }
    if (!formData.description.trim()) {
      setValidationError('Краткое описание не может быть пустым или состоять только из пробелов.')
      return
    }
    if (!formData.body.trim()) {
      setValidationError('Текст статьи не может быть пустым или состоять только из пробелов.')
      return
    }

    const nonEmptyTags = tags.map((t) => t.value.trim()).filter((t) => t !== '')

    dispatch(setFormData({ tagList: nonEmptyTags }))

    dispatch(
      submitArticle({
        articleData: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          body: formData.body.trim(),
          tagList: nonEmptyTags,
        },
        slug,
      })
    ).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        navigate('/')
      }
    })
  }

  return (
    <form className={styles['create-new-article']} onSubmit={handleSubmit}>
      <h1 className={styles.title}>{slug ? 'Edit Article' : 'Create New Article'}</h1>

      {validationError && <p className={styles['validation-error']}>{validationError}</p>}

      <label htmlFor="title-input" className={styles['title-create']}>
        Title
        <input
          id="title-input"
          type="text"
          name="title"
          placeholder="Title"
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
          name="body"
          placeholder="Text"
          className={styles.text}
          value={formData.body}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="tags" className={styles['create-tags']}>
        Tags
        <div className={styles['tags-container']}>
          {tags.map(({ id, value }, index) => (
            <div key={id} className={styles['tags-main']}>
              <input
                type="text"
                placeholder="Tag"
                value={value}
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
                  disabled={value.trim() === ''}
                >
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>
      </label>

      <button type="submit" className={styles['send-button']}>
        Send
      </button>
    </form>
  )
}
