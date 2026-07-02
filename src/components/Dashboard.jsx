import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, CheckCircle, AlertTriangle, GraduationCap, X } from 'lucide-react';
import { studentService } from '../services/studentService';
import StudentTable from './StudentTable';
import Pagination from './Pagination';
import StudentModal from './StudentModal';
import DeleteModal from './DeleteModal';

export default function Dashboard() {
  // Student List State
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(0); // 0-based for API
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Search State (with debounce)
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Notification Toast state
  const [toast, setToast] = useState(null);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(0); // Reset to page 0 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch Students Effect
  useEffect(() => {
    loadStudents();
  }, [currentPage, pageSize, sortBy, sortDir, debouncedSearch]);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents(
        currentPage,
        pageSize,
        sortBy,
        sortDir,
        debouncedSearch
      );
      
      // Support both raw list (if backend isn't paginated yet) and standard Page object
      if (data && Array.isArray(data.content)) {
        setStudents(data.content);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        // Fallback: If backend returns a plain array
        setStudents(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        throw new Error('Invalid API response format. Expected a Spring Boot Page response or array.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve student records.');
      showToast(err.message || 'Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show status toasts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Automatically close toast after 4s
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // CRUD operation triggers
  const handleOpenAddModal = () => {
    setSelectedStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleSaveStudent = async (formData) => {
    if (selectedStudent) {
      // Edit mode
      await studentService.updateStudent(selectedStudent.id, formData);
      showToast(`Student ${formData.name} updated successfully!`, 'success');
    } else {
      // Add mode
      await studentService.createStudent(formData);
      showToast(`Student ${formData.name} added successfully!`, 'success');
      setCurrentPage(0); // Jump back to first page
    }
    loadStudents();
  };

  const handleDeleteConfirm = async (id) => {
    await studentService.deleteStudent(id);
    showToast('Student deleted successfully!', 'success');
    
    // Adjust current page if we deleted the last item on the page
    if (students.length === 1 && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else {
      loadStudents();
    }
  };

  const handleSort = (key, dir) => {
    setSortBy(key);
    setSortDir(dir);
    setCurrentPage(0); // Reset page to first page when sort criteria changes
  };

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification alert-${toast.type} animate-slide-in`}>
          <div className="toast-content">
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="toast-icon-success" />
            ) : (
              <AlertTriangle size={18} className="toast-icon-error" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="toast-close">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <header className="dashboard-header">
        <div className="header-meta">
          <div className="brand-badge">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1>Institute Student Administration</h1>
            <p className="subtitle">View, search, edit and manage student records</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary btn-icon btn-lg btn-add"
        >
          <Plus size={20} />
          <span>Add New Student</span>
        </button>
      </header>

      {/* Main card */}
      <main className="dashboard-card">
        {/* Controls Bar */}
        <section className="controls-bar">
          {/* Search box */}
          <div className="search-box-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by name, surname, or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
            {searchText && (
              <button onClick={() => setSearchText('')} className="search-clear-btn" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Action Tools */}
          <div className="tools-container">
            <button
              onClick={loadStudents}
              disabled={isLoading}
              className={`btn btn-secondary icon-btn ${isLoading ? 'spinning' : ''}`}
              title="Refresh Data"
              aria-label="Refresh table data"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </section>

        {/* Error State Banner */}
        {error && (
          <div className="dashboard-error-banner alert alert-error">
            <AlertTriangle size={20} />
            <div className="error-message-content">
              <h4>Database Connection Refused</h4>
              <p>{error}</p>
              <p className="error-resolution-tip">
                Please make sure your Spring Boot backend service is running locally on port 8080 and CORS is enabled.
              </p>
            </div>
            <button onClick={loadStudents} className="btn btn-danger-outline btn-sm">
              Try Again
            </button>
          </div>
        )}

        {/* Data Table */}
        <StudentTable
          students={students}
          isLoading={isLoading}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />

        {/* Pagination Controls */}
        {!error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        )}
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />

      {/* Delete Student Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        student={selectedStudent}
      />
    </div>
  );
}
