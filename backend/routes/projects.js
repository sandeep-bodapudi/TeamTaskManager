const express = require('express');
const { z } = require('zod');
const Project = require('../models/Project');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(authMiddleware);

const projectSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    members: z.array(z.string()).optional()
});

// Admin creates a project
router.post('/', roleMiddleware(['Admin']), validate(projectSchema), async (req, res) => {
    try {
        const { title, description, members } = req.body;
        
        let projectMembers = [req.user.id]; // Admin is implicitly a member
        if (members && Array.isArray(members)) {
            const Team = require('../models/Team');
            const adminTeam = await Team.findOne({ adminId: req.user.id });
            const validTeamMemberIds = adminTeam ? adminTeam.members.map(id => id.toString()) : [];
            
            // Only allow members that exist in the admin's team
            const validRequestedMembers = members.filter(id => 
                id !== req.user.id && validTeamMemberIds.includes(id.toString())
            );
            projectMembers = [...projectMembers, ...validRequestedMembers];
        }

        const project = new Project({
            title,
            description,
            adminId: req.user.id,
            members: projectMembers
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// All: Get projects related to user
router.get('/', async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'Admin') {
            projects = await Project.find({ adminId: req.user.id }).populate('members', 'name email').lean();
        } else {
            projects = await Project.find({ members: req.user.id }).populate('adminId', 'name email').lean();
        }

        // Add task progress
        const Task = require('../models/Task');
        const projectsWithProgress = await Promise.all(projects.map(async (p) => {
            const totalTasks = await Task.countDocuments({ projectId: p._id });
            const completedTasks = await Task.countDocuments({ projectId: p._id, status: 'Completed' });
            return { ...p, totalTasks, completedTasks };
        }));

        res.json(projectsWithProgress);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

const memberSchema = z.object({
    email: z.string().email()
});

// Admin adds a member to a project
router.put('/:id/members', roleMiddleware(['Admin']), validate(memberSchema), async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, adminId: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });

        const userToAdd = await User.findOne({ email: req.body.email });
        if (!userToAdd) return res.status(404).json({ message: 'User not found' });

        if (project.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        project.members.push(userToAdd._id);
        await project.save();

        res.json({ message: 'Member added successfully', project });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
