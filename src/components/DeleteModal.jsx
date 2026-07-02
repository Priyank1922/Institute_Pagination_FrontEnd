import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  student
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await onConfirm(student.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-confirm animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header confirm-header">
          <div className="modal-title-container text-danger">
            <AlertTriangle className="modal-header-icon" size={20} />
            <h2 className="modal-title">Delete Student Record</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body confirm-body">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <p className="confirm-message">
            Are you sure you want to delete the student record for{' '}
            <strong className="text-primary">
              {student.name} {student.surname}
            </strong>
            ?
          </p>
          <p className="confirm-warning-sub">
            This action is permanent and cannot be undone. All database linkages for student{' '}
            <code className="code-id">#{student.id}</code> will be deleted.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer confirm-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger btn-icon"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner spinner-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
