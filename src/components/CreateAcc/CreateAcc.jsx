import { Form, Input, Button, Checkbox, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { register } from '../../slice/AuthSlice'
import styles from './CreateAcc.module.scss'

export default function CreateAcc() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth)
  useEffect(() => {
    if (error?.errors) {
      if (error.errors.username) {
        form.setFields([
          {
            name: 'username',
            errors: [error.errors.username],
          },
        ])
      }
      if (error.errors.email) {
        form.setFields([
          {
            name: 'email',
            errors: [error.errors.email],
          },
        ])
      }
    }
  }, [error, form])

  const onFinish = async (values) => {
    try {
      await dispatch(
        register({
          username: values.username,
          email: values.email,
          password: values.password,
        })
      )
    } catch (err) {
      if (!err.errors) {
        message.error(err.payload?.message || 'Register failed. Please try again.')
      }
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  return (
    <div className={styles['create-acc']}>
      <h1 className={styles.title}>Create new account</h1>
      <Form form={form} name="register" layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters' },
            { max: 20, message: 'Username must be at most 20 characters' },
          ]}
          rootClassName={styles.item}
        >
          <Input placeholder="Username" rootClassName={styles.input} />
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

        <Form.Item
          name="confirmPassword"
          label="Repeat Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('The two passwords do not match!'))
              },
            }),
          ]}
          rootClassName={styles.item}
        >
          <Input.Password placeholder="Repeat Password" rootClassName={styles.input} />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms')),
            },
          ]}
          rootClassName={styles['checkbox-box']}
        >
          <Checkbox rootClassName={styles['checkbox-agree']}>
            I agree to the processing of my personal information
          </Checkbox>
        </Form.Item>

        <Form.Item rootClassName={styles['submit-button__box']}>
          <Button type="primary" htmlType="submit" className={styles['submit-button']} loading={loading}>
            Create
          </Button>
        </Form.Item>

        <span className={styles['login-link']}>
          Already have an account?
          <Link to="/sign-in" className={styles['sign-in']}>
            {' '}
            Sign In.
          </Link>
        </span>
      </Form>
    </div>
  )
}
