const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/metrics', async (req, res) => {
    try {
        let projectIds = [];
        if (req.user.role === 'Admin') {
            const projects = await Project.find({ adminId: req.user.id }, '_id');
            projectIds = projects.map(p => p._id);
        } else {
            const projects = await Project.find({ members: req.user.id }, '_id');
            projectIds = projects.map(p => p._id);
        }

        const query = { projectId: { $in: projectIds } };
        if (req.user.role === 'Member') {
            query.assignedTo = req.user.id;
        }

        const allTasks = await Task.find(query)
            .populate('projectId', 'title')
            .populate('assignedTo', 'name')
            .lean();
            
        const now = new Date();

        const metrics = {
            totalTasks: allTasks.length,
            pendingTasks: allTasks.filter(t => t.status === 'Pending').length,
            inProgressTasks: allTasks.filter(t => t.status === 'In Progress').length,
            overdueTasks: allTasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length,
            ongoingTasks: allTasks
                .filter(t => t.status !== 'Completed')
                .sort((a, b) => {
                    if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
                    if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                })
                .slice(0, 5)
        };

        res.json(metrics);
    } catch (err) {
        console.error('Dashboard Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
