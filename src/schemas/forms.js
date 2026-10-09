import * as yup from 'yup'

const email = yup.string().trim().required('Email is required').email('Enter a valid email')
const password = yup.string().required('Password is required').min(6, 'Use at least 6 characters')

export const loginSchema = yup.object({ email, password })
export const registrationSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email,
  password,
})
export const bookingSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email,
  phone: yup.string().trim().required('Phone is required').matches(/^[+\d\s().-]{7,}$/, 'Enter a valid phone number'),
  reason: yup.string().required('Choose a reason'),
})
