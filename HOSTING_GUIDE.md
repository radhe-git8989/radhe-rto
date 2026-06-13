import os

# Render deployment script or manual setup instructions
# This file serves as a guide for the user to host on Render/Vercel

# 1. Create a GitHub Repository and push the 'radhe_insurance' folder.
# 2. On Render (render.com):
#    - Create a new 'Web Service'.
#    - Connect your GitHub repo.
#    - Select the 'backend' folder.
#    - Runtime: Python 3
#    - Build Command: pip install -r requirements.txt
#    - Start Command: gunicorn app:app
# 3. On Vercel (vercel.com):
#    - Create a new Project.
#    - Connect your GitHub repo.
#    - Select the 'frontend' folder.
#    - Framework Preset: Vite
#    - Build Command: npm run build
#    - Output Directory: dist
#    - IMPORTANT: Change the API URL in App.tsx/Form.tsx to your Render backend URL.
