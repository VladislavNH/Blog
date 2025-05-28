import { Form, Input, Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { login } from '../../slice/AuthSlice'
import styles from './SignIn.module.scss'

export default function SignIn() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (error?.errors) {
      if (error.errors['email or password']) {
        form.setFields([
          {
            name: 'password',
            errors: [`email or password: ${error.errors['email or password']}`],
          },
        ])
      }
    }
  }, [error, form])

  const onFinish = async (values) => {
    try {
      await dispatch(
        login({
          email: values.email,
          password: values.password,
        })
      ).unwrap()
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className={styles['login-form']}>
      <h2 className={styles.title}>Sign In</h2>
      <Form form={form} name="login" layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
          rootClassName={styles.item}
        >
          <Input placeholder="Email address" rootClassName={styles.input} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters' },
            { max: 40, message: 'Password must be at most 40 characters' },
          ]}
          rootClassName={styles.item}
        >
          <Input.Password placeholder="Password" rootClassName={styles.input} />
        </Form.Item>

        <Form.Item rootClassName={styles['item-button']}>
          <Button type="primary" htmlType="submit" className={styles['submit-button']} loading={loading}>
            Login
          </Button>
        </Form.Item>

        <div className={styles['signup-link']}>
          Don&#39;t have an account?
          <Link to="/sign-up" className={styles.link}>
            {' '}
            Sign Up
          </Link>
        </div>
      </Form>
    </div>
  )
}
