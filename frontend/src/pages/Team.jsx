import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { UserPlus, Trash2, Users, ShieldCheck, Crown } from 'lucide-react';

export default function Team() {
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/teams');
      if (res.data && res.data.members) setTeamMembers(res.data.members);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'Admin') fetchTeam();
  }, [user]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/teams/add', { email: newMemberEmail });
      setTeamMembers(res.data.team.members);
      setNewMemberEmail('');
      showNotification(`Member added successfully! ✅`, 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error adding member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId, name) => {
    if (!window.confirm(`Remove ${name} from your team? They will lose access to all projects.`)) return;
    try {
      const res = await api.delete(`/teams/remove/${userId}`);
      setTeamMembers(res.data.team.members);
      showNotification('Member removed and their tasks have been reassigned.', 'success');
    } catch (err) {
      showNotification('Error removing member', 'error');
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="empty-state">
        <ShieldCheck size={48} />
        <h3>Access Restricted</h3>
        <p>Only Admins can manage team members.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Users size={22} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 style={{ marginBottom: 0, color: 'var(--text-primary)' }}>My Team</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.125rem' }}>
            {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''} in your group
          </p>
        </div>
      </div>

      {/* Add Member Card */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.375rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
          Add Team Member
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8375rem', marginBottom: '1.25rem' }}>
          Enter the exact registered email address of the person you want to add to your team.
        </p>
        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="colleague@example.com"
              value={newMemberEmail}
              onChange={e => setNewMemberEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '42px' }}>
            <UserPlus size={18} />
            {loading ? 'Adding…' : 'Add Member'}
          </button>
        </form>
      </div>

      {/* Members List */}
      <div style={{ marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Current Members ({teamMembers.length})
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {teamMembers.map(member => (
          <div
            key={member._id}
            className="glass-card"
            style={{ padding: '1rem 1.125rem' }}
          >
            {/* Top row: avatar + name/email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'var(--accent-light)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
              }}>
                <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.125rem' }}>
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.125rem', fontSize: '0.9375rem' }}>
                  {member.name}
                </p>
                <p style={{
                  fontSize: '0.8rem', color: 'var(--text-muted)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {member.email}
                </p>
              </div>
              <span className="status-badge status-progress" style={{ fontWeight: 600, flexShrink: 0 }}>
                Member
              </span>
            </div>

            {/* Bottom row: remove button full-width on mobile */}
            <button
              onClick={() => handleRemoveMember(member._id, member.name)}
              className="btn btn-danger"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', padding: '0.5rem' }}
            >
              <Trash2 size={15} /> Remove from Team
            </button>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <div className="glass-card empty-state">
            <Users size={48} />
            <h3>No members yet</h3>
            <p>Add your first team member above using their registered email address.</p>
          </div>
        )}
      </div>
    </div>
  );
}
