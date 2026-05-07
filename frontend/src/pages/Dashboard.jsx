import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Loader2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateIST } from '../utils/dateFormatter';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({ totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, overdueTasks: 0, ongoingTasks: [] });
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    api.get('/dashboard/metrics')
      .then(res => setMetrics(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const metricCards = [
    {
      label: 'Total Tasks',
      value: metrics.totalTasks,
      icon: <TrendingUp size={24} />,
      iconBg: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
      valueCls: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Pending',
      value: metrics.pendingTasks,
      icon: <Clock size={24} />,
      iconBg: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
      valueCls: 'text-amber-600 dark:text-amber-400'
    },
    {
      label: 'Processing',
      value: metrics.inProgressTasks,
      icon: <Loader2 size={24} />,
      iconBg: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
      valueCls: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Overdue',
      value: metrics.overdueTasks,
      icon: <AlertCircle size={24} />,
      iconBg: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400',
      valueCls: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest mb-1"
           style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })}
        </p>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          {greeting},{' '}
          <span style={{ color: 'var(--accent)' }}>{user?.name}</span>! 👋
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Here's your workspace overview for today.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metricCards.map(card => (
          <div key={card.label} className="metric-card">
            <div className={`metric-icon rounded-xl ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className={`metric-value ${card.valueCls}`}>
              {loading ? '—' : card.value}
            </div>
            <div className="metric-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Ongoing Tasks */}
      <div className="glass-card">
        <div className="section-header">
          <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            <Loader2 size={18} style={{ color: 'var(--accent)' }} />
            In-Progress Tasks
          </h2>
          <Link
            to="/projects"
            className="text-sm font-semibold flex items-center gap-1"
            style={{ color: 'var(--accent)' }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="empty-state">
            <p style={{ color: 'var(--text-muted)' }}>Loading tasks…</p>
          </div>
        ) : metrics.ongoingTasks && metrics.ongoingTasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {metrics.ongoingTasks.map(task => (
              <div key={task._id} className="task-row">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    {task.projectId?.title && (
                      <span className="chip">{task.projectId.title}</span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Due {formatDateIST(task.dueDate)}
                    </span>
                    {user.role === 'Admin' && task.assignedTo?.name && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        → {task.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`status-badge ${task.status === 'In Progress' ? 'status-progress' : 'status-pending'}`}>
                    {task.status}
                  </span>
                  <Link
                    to={`/projects/${task.projectId?._id || task.projectId}`}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle2 size={48} />
            <h3>All clear!</h3>
            <p>You have no ongoing tasks right now. Great job! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
