import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { loginSchema, registrationSchema } from '../../schemas/forms.js'
import Modal from './Modal.jsx'

export default function AuthModal({ mode, onModeChange, onClose, notice }) {
  const { login, register: registerUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const isRegistration = mode === 'register'
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(isRegistration ? registrationSchema : loginSchema),
  })

  async function submit(values) {
    setServerError('')
    try {
      if (isRegistration) await registerUser(values.name, values.email, values.password)
      else await login(values.email, values.password)
      onClose()
    } catch (error) {
      setServerError(error.code === 'account-exists' ? 'This email already has an account.' : error.code === 'invalid-credentials' ? 'Email or password is incorrect.' : 'We could not complete that request. Please try again.')
    }
  }

  return (
    <Modal title={isRegistration ? 'Registration' : 'Log in'} onClose={onClose}>
      <div className="modal-content">
        <h2>{isRegistration ? 'Registration' : 'Log In'}</h2>
        <p className="modal-intro">{isRegistration ? 'Create your account and find the right language teacher for you.' : 'Welcome back! Sign in to save teachers and keep planning your next lesson.'}</p>
        {notice && <p className="notice" role="status">{notice}</p>}
        <form onSubmit={handleSubmit(submit)} noValidate>
          {isRegistration && <div className="form-field"><label htmlFor="auth-name">Name</label><input id="auth-name" placeholder="Name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name')} />{errors.name && <span className="field-error">{errors.name.message}</span>}</div>}
          <div className="form-field"><label htmlFor="auth-email">Email</label><input id="auth-email" type="email" placeholder="Email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email')} />{errors.email && <span className="field-error">{errors.email.message}</span>}</div>
          <div className="form-field"><label htmlFor="auth-password">Password</label><div className="password-field"><input id="auth-password" type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete={isRegistration ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} {...register('password')} /><button type="button" className="icon-button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>{errors.password && <span className="field-error">{errors.password.message}</span>}</div>
          {serverError && <p className="form-error" role="alert">{serverError}</p>}
          <button className="button button-primary button-wide" disabled={isSubmitting} type="submit">{isSubmitting ? 'Please wait...' : isRegistration ? 'Sign Up' : 'Log In'}</button>
        </form>
        <p className="modal-switch">{isRegistration ? 'Already have an account?' : 'New to LearnLingo?'} <button type="button" onClick={() => onModeChange(isRegistration ? 'login' : 'register')}>{isRegistration ? 'Log in' : 'Register'}</button></p>
      </div>
    </Modal>
  )
}
