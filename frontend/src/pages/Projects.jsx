import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { Plus, X, Search, FolderKanban } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', members: [] });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle User Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        try {
          const res = await api.get(`/teams/search?q=${searchQuery}`);
          setSearchResults(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addUserToProject = (userToAdd) => {
    if (!selectedUsers.find(u => u._id === userToAdd._id) && userToAdd._id !== user.id) {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setNewProject({ ...newProject, members: [...newProject.members, userToAdd._id] });
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
    setNewProject({ ...newProject, members: newProject.members.filter(id => id !== userId) });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '', members: [] });
      setSelectedUsers([]);
      setSearchQuery('');
      showNotification('Project created successfully', 'success');
      fetchProjects();
    } catch (err) {
      showNotification('Error creating project', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {user?.role === 'Admin' ? 'Manage your projects and assign tasks to your team.' : 'Projects assigned to you by your Admin.'}
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          // Calculate progress safely
          const total = project.totalTasks || 0;
          const completed = project.completedTasks || 0;
          const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

          return (
            <Link to={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.375rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8375rem', flex: 1, marginBottom: '1.25rem' }}>
                  {project.description || 'No description'}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>
                  {user.role === 'Admin' ? `${project.members.length} Member${project.members.length !== 1 ? 's' : ''}` : `Admin: ${project.adminId?.name || 'N/A'}`}
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 500 }}>
                    <span>Progress</span>
                    <span style={{ color: progressPercent === 100 ? 'var(--done-text)' : 'var(--text-secondary)', fontWeight: 700 }}>
                      {progressPercent}% ({completed}/{total})
                    </span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {projects.length === 0 && (
        <div className="glass-card empty-state">
          <FolderKanban size={48} />
          {user.role === 'Admin' ? (
            <><h3>No Projects Yet</h3><p>Create your first project and assign tasks to your team members.</p></>
          ) : (
            <><h3>No Assigned Projects</h3><p>Please wait until your lead assigns you to a project.</p></>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input type="text" className="form-input" required placeholder="e.g. Website Redesign"
                  value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea className="form-input" rows="3" placeholder="Brief project description..."
                  value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}></textarea>
              </div>

              {/* Member Search */}
              <div className="form-group">
                <label className="form-label">Assign Team Members</label>

                {selectedUsers.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {selectedUsers.map(u => (
                      <span key={u._id} className="chip">
                        {u.name}
                        <X size={13} style={{ cursor: 'pointer', color: 'var(--danger-text)' }} onClick={() => removeUser(u._id)} />
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0 0.75rem' }}>
                    <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input type="text"
                      placeholder="Type 3+ letters to search team members..."
                      style={{ flex: 1, padding: '0.625rem 0.5rem', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                    Only members in your Team will appear.
                  </p>

                  {searchResults.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: '8px', maxHeight: '160px', overflowY: 'auto',
                      boxShadow: 'var(--shadow-md)', zIndex: 20
                    }}>
                      {searchResults.map(u => (
                        <div key={u._id}
                          onClick={() => addUserToProject(u)}
                          style={{
                            padding: '0.625rem 0.875rem', cursor: 'pointer',
                            borderBottom: '1px solid var(--border)', transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setSearchQuery(''); setSearchResults([]); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
