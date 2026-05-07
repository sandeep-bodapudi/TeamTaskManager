const express = require('express');
const { z } = require('zod');
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(authMiddleware);

const taskSchema = z.object({
    projectId: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    assignedTo: z.string(),
    dueDate: z.string()
});

// Admin creates a task
router.post('/', roleMiddleware(['Admin']), validate(taskSchema), async (req, res) => {
    try {
        const { projectId, title, description, assignedTo, dueDate } = req.body;
        
        // Verify project belongs to admin
        const project = await Project.findOne({ _id: projectId, adminId: req.user.id });
        if (!project) return res.status(403).json({ message: 'Forbidden or project not found' });

        // Verify assigned user is in project
        if (!project.members.includes(assignedTo)) {
            return res.status(400).json({ message: 'Assigned user is not a member of this project' });
        }

        const task = new Task({ projectId, title, description, assignedTo, dueDate: new Date(dueDate) });
        await task.save();

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// All: Get tasks for a project
router.get('/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // IDOR protection
        if (req.user.role === 'Member' && !project.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.user.role === 'Admin' && project.adminId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const tasks = await Task.find({ projectId })
            .populate('assignedTo', 'name email')
            .skip(skip)
            .limit(limit);
        
        const total = await Task.countDocuments({ projectId });

        res.json({ tasks, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

const statusSchema = z.object({
    status: z.enum(['Pending', 'In Progress', 'Completed'])
});

// Member/Admin updates task status
router.patch('/:id/status', validate(statusSchema), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // IDOR protection
        if (req.user.role === 'Member' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You can only update your assigned tasks' });
        }

        if (req.user.role === 'Admin') {
            const project = await Project.findById(task.projectId);
            if (!project) return res.status(404).json({ message: 'Project not found' });
            if (project.adminId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        task.status = req.body.status;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin deletes a task
router.delete('/:id', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Verify admin owns the project this task belongs to
        const project = await Project.findById(task.projectId);
        if (!project || project.adminId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
