#!/usr/bin/env bash
set -e

# ==========================================================
# RMC GROUP SUITE - VPS DEPLOYMENT & RESTORE SCRIPT
# Run this script directly on your VPS (72.61.255.101 as root)
# ==========================================================

FRONTEND_PORT=8070
BACKEND_PORT=5000
DB_NAME="rmc_db"
DB_USER="postgres"
PROJECT_DIR="/var/www/rmc-group"

echo "============================================"
echo "🚀 Starting RMC Group Suite Setup on VPS"
echo "============================================"

# 1. Setup PostgreSQL Database
echo "📦 Step 1: Setting up PostgreSQL Database (${DB_NAME})..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"

# Restore database dump if exists
if [ -f "rmc_backup.sql" ]; then
    echo "🔄 Restoring database from rmc_backup.sql..."
    sudo -u postgres psql -d ${DB_NAME} -f rmc_backup.sql
    echo "✅ Database restored successfully!"
else
    echo "⚠️ rmc_backup.sql not found in current directory. Database created empty (tables will be created by backend schema)."
fi

# 2. Setup Project Directory
echo "📁 Step 2: Preparing ${PROJECT_DIR}..."
mkdir -p ${PROJECT_DIR}

# 3. Environment files
echo "⚙️ Step 3: Configuring Backend & Frontend Environment..."

cat << 'EOF' > ${PROJECT_DIR}/backend/.env
PORT=5000
DATABASE_URL=postgresql://postgres@localhost:5432/rmc_db
JWT_SECRET=rmc_civil_super_secret_jwt_key_2026
NODE_ENV=production
EOF

# 4. Install Dependencies & Build
echo "📦 Step 4: Installing backend packages..."
cd ${PROJECT_DIR}/backend
npm install --production

echo "📦 Installing frontend & Building production bundle..."
cd ${PROJECT_DIR}/frontend
cat << 'EOF' > .env.production
VITE_API_URL=http://72.61.255.101:5000/api
EOF
npm install
npm run build

# 5. PM2 Process Management
echo "🚀 Step 5: Configuring PM2 for Backend & Frontend..."
npm install -g serve pm2 || true

pm2 delete rmc-backend || true
pm2 delete rmc-frontend || true

# Start backend
cd ${PROJECT_DIR}/backend
pm2 start src/server.js --name "rmc-backend"

# Serve frontend build on port 8070 (already open in UFW)
cd ${PROJECT_DIR}/frontend
pm2 start "npx serve -s dist -l 8070" --name "rmc-frontend"

pm2 save

# 6. Verify UFW Firewall Rules
echo "🛡️ Step 6: Verifying Firewall ports..."
ufw allow 8070/tcp || true
ufw allow 5000/tcp || true
ufw reload || true

echo "============================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌐 Frontend URL: http://72.61.255.101:8070"
echo "🔌 Backend API:  http://72.61.255.101:5000"
echo "============================================"

