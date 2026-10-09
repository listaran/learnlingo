import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { bookingSchema } from '../../schemas/forms.js'
import { writeRecord } from '../../services/db.js'
import Modal from './Modal.jsx'

const reasons = ['Career and business', 'Lesson for kids', 'Living abroad', 'Exams and coursework', 'Culture, travel, or hobby']

export default function BookingModal({ teacher, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(bookingSchema) })

  return (
    <Modal title="Book trial lesson" onClose={onClose}>
      <div className="modal-content booking-modal">
        {submitted ? <>
          <h2>Request saved</h2>
          <p className="modal-intro">Your trial lesson request with {teacher.name} {teacher.surname} has been saved on this device.</p>
          <button className="button button-primary button-wide" onClick={onClose}>Done</button>
        </> : <>
          <h2>Book trial lesson</h2>
          <p className="modal-intro">Start with a trial lesson with {teacher.name} {teacher.surname}.</p>
          <div className="booking-teacher"><img src={teacher.avatar_url} alt="" /><span><small>Your teacher</small><strong>{teacher.name} {teacher.surname}</strong></span></div>
          <form onSubmit={handleSubmit(async (values) => {
            try {
              await writeRecord('bookings', { ...values, teacherId: teacher.id, createdAt: new Date().toISOString() }, 'add')
              setSubmitted(true)
            } catch {
              setSaveError('Could not save the request. Please try again.')
            }
          })} noValidate>
            <fieldset className="reason-fieldset"><legend>What is your main reason for learning?</legend>{reasons.map((reason) => <label key={reason} className="radio-choice"><input type="radio" value={reason} {...register('reason')} /><span>{reason}</span></label>)}{errors.reason && <span className="field-error">{errors.reason.message}</span>}</fieldset>
            <div className="form-field"><label htmlFor="booking-name">Name</label><input id="booking-name" placeholder="Name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name')} />{errors.name && <span className="field-error">{errors.name.message}</span>}</div>
            <div className="form-field"><label htmlFor="booking-email">Email</label><input id="booking-email" type="email" placeholder="Email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email')} />{errors.email && <span className="field-error">{errors.email.message}</span>}</div>
            <div className="form-field"><label htmlFor="booking-phone">Phone number</label><input id="booking-phone" type="tel" placeholder="Phone number" autoComplete="tel" aria-invalid={Boolean(errors.phone)} {...register('phone')} />{errors.phone && <span className="field-error">{errors.phone.message}</span>}</div>
            {saveError && <p className="form-error" role="alert">{saveError}</p>}
            <button className="button button-primary button-wide" type="submit" disabled={isSubmitting}>Book</button>
          </form>
        </>}
      </div>
    </Modal>
  )
}
