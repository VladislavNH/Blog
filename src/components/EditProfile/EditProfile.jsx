import { Form, Input, Button } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../../features/AuthSlice'
import styles from './EditProfile.module.scss'

export default function EditProfile() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        avatarImage: user.image || '',
      })
    }
    if (error?.errors) {
      const fieldsToUpdate = []
      const errorFields = {
        username: 'username',
        email: 'email',
        image: 'avatarImage',
        password: 'newPassword',
      }

      Object.entries(errorFields).forEach(([errorKey, fieldName]) => {
        if (error.errors[errorKey]) {
          const errorMessage = error.errors[errorKey]
          fieldsToUpdate.push({
            name: fieldName,
            errors: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
          })
        }
      })

      if (fieldsToUpdate.length > 0) {
        form.setFields(fieldsToUpdate)
      }
    }
  }, [user, error, form])

  const onFinish = async (values) => {
    const userData = {
      username: values.username,
      email: values.email,
      image: values.avatarImage || null,
    }

    if (values.newPassword) {
      userData.password = values.newPassword
    }

    try {
      await dispatch(updateProfile(userData))
      navigate('/')
    } catch (err) {
      console.error('Update profile error:', err)
    }
  }

  return (
    <div className={styles['edit-profile']}>
      <h1 className={styles.title}>Edit Profile</h1>
      <Form form={form} name="edit-profile" layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
          rootClassName={styles.item}
        >
          <Input rootClassName={styles.input} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
          rootClassName={styles.item}
        >
          <Input rootClassName={styles.input} />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
          rootClassName={styles.item}
        >
          <Input.Password placeholder="Leave empty to keep current" rootClassName={styles.input} />
        </Form.Item>
        <Form.Item
          name="avatarImage"
          label="Avatar image (url)"
          rules={[
            { type: 'url', message: 'Please enter a valid URL' },
            { max: 255, message: 'URL must be at most 255 characters' },
          ]}
          rootClassName={styles.item}
        >
          <Input placeholder="Avatar image" rootClassName={styles.input} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.button} loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}