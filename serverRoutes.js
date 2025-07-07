const express = require('express');
const router = express.Router();
const Server = require('../models/Server');
const { createFiveMContainer, stopAndRemoveContainer } = require('../dockerService');

// Create new server endpoint
router.post('/create', async (req, res) => {
  const { ownerDiscordId, port } = req.body;

  if (!ownerDiscordId || !port) {
    return res.status(400).json({ message: 'ownerDiscordId and port are required' });
  }

  try {
    const containerId = await createFiveMContainer(port);
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours expiry

    const server = new Server({
      ownerDiscordId,
      containerId,
      port,
      expiresAt,
    });

    await server.save();

    res.status(201).json({ message: 'Server created', server });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server creation failed' });
  }
});

// List all servers for user
router.get('/:ownerDiscordId', async (req, res) => {
  try {
    const servers = await Server.find({ ownerDiscordId: req.params.ownerDiscordId });
    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch servers' });
  }
});

// Delete server endpoint
router.delete('/:id', async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) return res.status(404).json({ message: 'Server not found' });

    await stopAndRemoveContainer(server.containerId);
    await server.deleteOne();

    res.json({ message: 'Server deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete server' });
  }
});

module.exports = router;
