const express = require('express');
const { z } = require('zod');
const Team = require('../models/Team');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(authMiddleware);

// Get Team for current user
router.get('/', async (req, res) => {
    try {
        let team;
        if (req.user.role === 'Admin') {
            team = await Team.findOne({ adminId: req.user.id }).populate('members', 'name email role');
            if (!team) {
                // Auto-create team for admin if it doesn't exist
                team = new Team({ adminId: req.user.id, members: [] });
                await team.save();
            }
        } else {
            // Member finding their team
            team = await Team.findOne({ members: req.user.id }).populate('adminId', 'name email');
        }
        res.json(team);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

const addMemberSchema = z.object({
    email: z.string().email()
});

// Admin adds member by EXACT email
router.post('/add', roleMiddleware(['Admin']), validate(addMemberSchema), async (req, res) => {
    try {
        const { email } = req.body;
        
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) return res.status(404).json({ message: 'User not found with that email' });
        if (userToAdd.role === 'Admin') return res.status(400).json({ message: 'Cannot add another Admin to a team' });

        let team = await Team.findOne({ adminId: req.user.id });
        if (!team) {
            team = new Team({ adminId: req.user.id, members: [] });
        }

        if (team.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User is already in your team' });
        }

        // Check if user is already in ANOTHER team
        const existingTeam = await Team.findOne({ members: userToAdd._id });
        if (existingTeam) {
            return res.status(400).json({ message: 'User is already assigned to a different lead' });
        }

        team.members.push(userToAdd._id);
        await team.save();
        
        await team.populate('members', 'name email role');
        res.json({ message: 'Member added to team', team });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove member from team
router.delete('/remove/:userId', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const team = await Team.findOne({ adminId: req.user.id });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        team.members = team.members.filter(id => id.toString() !== req.params.userId);
        await team.save();
        
        // LOOPHOLE FIX: Remove this user from all Projects owned by this Admin
        const Project = require('../models/Project');
        await Project.updateMany(
            { adminId: req.user.id },
            { $pull: { members: req.params.userId } }
        );

        // Optional: Reassign their tasks back to the admin or mark as unassigned. 
        // For now, we will leave them assigned but they can't access them anymore due to project removal.
        // Actually, let's reassign to the Admin so they aren't lost.
        const Task = require('../models/Task');
        const adminProjects = await Project.find({ adminId: req.user.id }, '_id');
        const projectIds = adminProjects.map(p => p._id);
        await Task.updateMany(
            { projectId: { $in: projectIds }, assignedTo: req.params.userId },
            { $set: { assignedTo: req.user.id, status: 'Pending' } }
        );

        await team.populate('members', 'name email role');
        res.json({ message: 'Member removed from team and all projects', team });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search within Admin's Team
router.get('/search', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.length < 3) return res.json([]);

        const team = await Team.findOne({ adminId: req.user.id }).populate({
            path: 'members',
            match: {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            },
            select: 'name email role'
        });

        if (!team) return res.json([]);
        res.json(team.members);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
