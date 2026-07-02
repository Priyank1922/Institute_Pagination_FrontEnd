import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

export default function StudentModal({
  isOpen,
  onClose,
  onSave,
  student = null // If non-null, we are in Edit Mode
}) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reset form or load student data when modal opens/student changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        surname: student.surname || '',
        gender: student.gender || '',
        email: student.email || ''
      });
    } else {
      setFormData({
        name: '',
        surname: '',
        gender: '',
        email: ''
      });
    }
    setErrors({});
    setSubmitError('');
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'First name is required';
    }
    if (!formData.surname.trim()) {
      newErrors.surname = 'Last name is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while saving the student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!student;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-container">
            <UserPlus className="modal-header-icon" size={20} />
            <h2 className="modal-title">{isEditMode ? 'Update Student Profile' : 'Register New Student'}</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {submitError && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="form-grid">
            {/* First Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label required">First Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                autoFocus
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label htmlFor="surname" className="form-label required">Last Name</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="e.g. Doe"
                className={`form-input ${errors.surname ? 'input-error' : ''}`}
              />
              {errors.surname && <span className="error-text">{errors.surname}</span>}
            </div>
          </div>

          <div className="form-grid">
            {/* Gender Select */}
            <div className="form-group">
              <label htmlFor="gender" className="form-label required">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`form-input select-input ${errors.gender ? 'input-error' : ''}`}
              >
                <option value="">Select gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label required">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john.doe@example.com"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditMode ? 'Update Record' : 'Save Record'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
