const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Health Check
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

// Project API Calls
export async function fetchProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`);
  return await res.json();
}

export async function fetchProjectById(id) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`);
  return await res.json();
}

export async function saveProjectToBackend(projectPayload) {
  const res = await fetch(`${API_BASE_URL}/projects/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectPayload),
  });
  return await res.json();
}

export async function deleteProjectFromBackend(id) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

// Client API Calls
export async function fetchClients() {
  const res = await fetch(`${API_BASE_URL}/clients`);
  return await res.json();
}

export async function saveClientToBackend(clientPayload) {
  const res = await fetch(`${API_BASE_URL}/clients/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientPayload),
  });
  return await res.json();
}

export async function deleteClientFromBackend(id) {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

