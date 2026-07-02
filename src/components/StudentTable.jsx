import React from 'react';
import { Edit, Trash2, ArrowUp, ArrowDown, ArrowUpDown, User } from 'lucide-react';

export default function StudentTable({
  students,
  isLoading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete
}) {
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'First Name', sortable: true },
    { key: 'surname', label: 'Last Name', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true }
  ];

  const handleHeaderClick = (key, sortable) => {
    if (!sortable) return;
    const newDir = sortBy === key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(key, newDir);
  };

  const renderSortIcon = (col) => {
    if (!col.sortable) return null;
    if (sortBy === col.key) {
      return sortDir === 'asc' 
        ? <ArrowUp className="sort-icon active" size={14} /> 
        : <ArrowDown className="sort-icon active" size={14} />;
    }
    return <ArrowUpDown className="sort-icon" size={14} />;
  };

  // Helper for gender badges
  const renderGenderBadge = (gender) => {
    if (!gender) return null;
    const normalized = gender.toLowerCase();
    let badgeClass = 'badge-gray';
    if (normalized === 'male' || normalized === 'm') badgeClass = 'badge-blue';
    else if (normalized === 'female' || normalized === 'f') badgeClass = 'badge-pink';
    else if (normalized === 'other' || normalized === 'o') badgeClass = 'badge-purple';

    return <span className={`badge ${badgeClass}`}>{gender}</span>;
  };

  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleHeaderClick(col.key, col.sortable)}
                className={col.sortable ? 'sortable-header' : ''}
              >
                <div className="header-cell">
                  <span>{col.label}</span>
                  {renderSortIcon(col)}
                </div>
              </th>
            ))}
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Skeleton loader for 5 rows
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="skeleton-row">
                <td><div className="skeleton-block skeleton-id" /></td>
                <td><div className="skeleton-block skeleton-text" /></td>
                <td><div className="skeleton-block skeleton-text" /></td>
                <td><div className="skeleton-block skeleton-badge" /></td>
                <td><div className="skeleton-block skeleton-email" /></td>
                <td>
                  <div className="actions-cell">
                    <div className="skeleton-block skeleton-btn" />
                    <div className="skeleton-block skeleton-btn" />
                  </div>
                </td>
              </tr>
            ))
          ) : students.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                <div className="empty-message-container">
                  <User size={48} className="empty-icon" />
                  <p className="empty-title">No Students Found</p>
                  <p className="empty-subtitle">Try refining your search or add a new student record.</p>
                </div>
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id} className="student-row">
                <td className="font-mono text-secondary">#{student.id}</td>
                <td className="font-semibold">{student.name}</td>
                <td>{student.surname}</td>
                <td>{renderGenderBadge(student.gender)}</td>
                <td className="email-cell">{student.email}</td>
                <td>
                  <div className="actions-cell">
                    <button
                      onClick={() => onEdit(student)}
                      className="btn-action btn-edit"
                      title="Edit Student"
                      aria-label={`Edit ${student.name} ${student.surname}`}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="btn-action btn-delete"
                      title="Delete Student"
                      aria-label={`Delete ${student.name} ${student.surname}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
