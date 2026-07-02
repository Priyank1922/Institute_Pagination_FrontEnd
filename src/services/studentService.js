import { API_BASE_URL } from '../config';

/**
 * Service for communicating with the Spring Boot Student Pagination API.
 */
export const studentService = {
  /**
   * Fetch a paginated, sorted, and searched list of students.
   * 
   * @param {number} page - Current page number (0-indexed)
   * @param {number} size - Number of records per page
   * @param {string} sortBy - Field to sort by (e.g., 'id', 'name', 'surname', 'email', 'gender')
   * @param {string} sortDir - Sort direction ('asc' or 'desc')
   * @param {string} search - Search query term
   */
  async getStudents(page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    });

    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }
    
    return await response.json();
  },

  /**
   * Create a new student.
   * @param {Object} student - Student data (name, surname, gender, email)
   */
  async createStudent(student) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create student');
    }

    return await response.json();
  },

  /**
   * Update an existing student.
   * @param {number|string} id - Student ID
   * @param {Object} student - Updated student data
   */
  async updateStudent(id, student) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update student');
    }

    return await response.json();
  },

  /**
   * Delete a student by ID.
   * @param {number|string} id - Student ID
   */
  async deleteStudent(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete student: ${response.statusText}`);
    }

    return true;
  }
};
