window.onload = async function() {
    const studentId = '12345'; // This should be dynamic based on the logged-in user
    await loadAttendanceSummary(studentId);
    await loadAttendanceHistory(studentId);
  }
  
  // Fetch and display attendance summary (total classes, present, absent)
  async function loadAttendanceSummary(studentId) {
    try {
      const response = await fetch(`/api/attendance/view/${studentId}`);
      const data = await response.json();
      
      const totalClasses = data.length;
      const totalPresent = data.filter(record => record.status === 'Present').length;
      const totalAbsent = totalClasses - totalPresent;
  
      document.getElementById('total-classes').textContent = totalClasses;
      document.getElementById('total-present').textContent = totalPresent;
      document.getElementById('total-absent').textContent = totalAbsent;
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
    }
  }
  
  // Fetch and display attendance history in a table
  async function loadAttendanceHistory(studentId) {
    try {
      const response = await fetch(`/api/attendance/view/${studentId}`);
      const data = await response.json();
      
      const tableBody = document.querySelector('#attendance-table tbody');
      tableBody.innerHTML = ''; // Clear previous data
      
      data.forEach(record => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const statusCell = document.createElement('td');
        
        dateCell.textContent = new Date(record.date).toLocaleDateString();
        statusCell.textContent = record.status;
  
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching attendance history:", err);
    }
  }
  