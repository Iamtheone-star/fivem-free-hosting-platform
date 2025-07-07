const Docker = require('dockerode');
const docker = new Docker();

async function createFiveMContainer(port) {
  // Pull image if not exists (you should prepare your own FiveM image or use public one)
  // Here we assume you have an image 'fivem-server'

  const container = await docker.createContainer({
    Image: 'fivem-server', // Replace with your actual image name
    name: `fivem_${port}`,
    ExposedPorts: {
      [`${port}/udp`]: {},
      [`${port}/tcp`]: {}
    },
    HostConfig: {
      PortBindings: {
        [`${port}/udp`]: [{ HostPort: port.toString() }],
        [`${port}/tcp`]: [{ HostPort: port.toString() }]
      }
    }
  });

  await container.start();
  return container.id;
}

async function stopAndRemoveContainer(containerId) {
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
    await container.remove();
  } catch (error) {
    console.error('Error stopping/removing container:', error);
  }
}

module.exports = { createFiveMContainer, stopAndRemoveContainer };
