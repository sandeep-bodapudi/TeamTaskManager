import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { Plus, UserPlus, ArrowLeft, ClipboardList } from 'lucide-react';
import { formatDateIST } from '../utils/dateFormatter';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);

  const [tasks, setTasks] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/project/${id}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjectInfo = async () => {
    try {
      const res = await api.get('/projects');
      const proj = res.data.find(p => p._id === id);
      if (proj) {
        setProjectTitle(proj.title);
        if (proj.members && Array.isArray(proj.members)) {
          if (user.role === 'Admin') {
            setProjectMembers(proj.members);
            if (proj.members.length > 0) {
              setNewTask(prev => ({ ...prev, assignedTo: proj.members[0]._id }));
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjectInfo();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: projectMembers[0]?._id || '', dueDate: '' });
      showNotification('Task created successfully ✅', 'success');
      fetchTasks();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error creating task', 'error');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}/members`, { email: newMemberEmail });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProjectInfo();
      showNotification('Member added to project ✅', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error adding member', 'error');
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      showNotification(`Status updated to "${newStatus}" ✅`, 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error updating status', 'error');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-progress';
    return 'status-completed';
  };

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Back + Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/projects" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500,
          marginBottom: '1rem'
        }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{projectTitle || 'Project Tasks'}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} · {completed} completed
            </p>
          </div>
          {user?.role === 'Admin' && (
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setShowMemberModal(true)}>
                <UserPlus size={16} /> Add Member
              </button>
              <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                <Plus size={16} /> New Task
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Project Progress
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {progressPct}%
              </span>
            </div>
            <div className="progress-container">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.map(task => (
          <div key={task._id} className="task-row" style={{ flexWrap: 'wrap' }}>
            {/* Info */}
            <div style={{ flex: 1, minWidth: '0' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
                {task.title}
              </p>
              {task.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                  {task.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>📅 {formatDateIST(task.dueDate)}</span>
                <span>👤 {task.assignedTo?.name || 'Unassigned'}</span>
              </div>
            </div>

            {/* Status Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
              <select
                className={`form-input ${getStatusClass(task.status)}`}
                style={{
                  width: 'auto', fontWeight: 700, cursor: 'pointer',
                  padding: '0.375rem 2.25rem 0.375rem 0.75rem',
                  fontSize: '0.8125rem', borderRadius: '8px'
                }}
                value={task.status}
                onChange={e => updateStatus(task._id, e.target.value)}
                disabled={user.role === 'Member' && task.assignedTo?._id !== user.id}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="glass-card empty-state">
            <ClipboardList size={48} />
            {user.role === 'Admin' ? (
              <>
                <h3>No Tasks Yet</h3>
                <p>Create the first task and assign it to a team member to get started.</p>
              </>
            ) : (
              <>
                <h3>No Tasks Assigned</h3>
                <p>Please wait until your lead assigns you a task in this project.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" required placeholder="e.g. Design login screen"
                  value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea className="form-input" rows="2" placeholder="Brief description of the task..."
                  value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-input" required value={newTask.assignedTo}
                  onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                  {projectMembers.map(m => (
                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" required
                  value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '0.375rem', color: 'var(--text-primary)' }}>Add Member to Project</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              The member must already be in your Team. Enter their registered email address.
            </p>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" required placeholder="member@company.com"
                  value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><UserPlus size={16} /> Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
