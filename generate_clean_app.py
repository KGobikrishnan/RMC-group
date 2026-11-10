import subprocess

# Get clean App.jsx from HEAD
original = subprocess.check_output(['git', 'show', 'HEAD:frontend/src/App.jsx']).decode('utf-8')

# Let's inspect original updaters and modules
# In HEAD, did it have updateTiles etc?
print("Has updateTiles:", "updateTiles" in original)
print("Has TilesModule:", "TilesModule" in original)
