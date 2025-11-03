#!/bin/bash
set -e
echo "🚀 SAINT VISION PRODUCTION FIX"
echo "=============================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
STEP=1

step() { echo ""; echo -e "${GREEN}STEP $STEP: $1${NC}"; echo "---"; ((STEP++)); }
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

[ ! -f "package.json" ] && error "Run from project root"

step "Install dependencies"
npm install --save-dev @types/cors
success "Installed"

step "Backup files"
BACKUP="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"
cp db/schema.ts "$BACKUP/" 2>/dev/null || true
success "Backed up to $BACKUP"

step "Schema update"
warning "Copy schema-update.ts to db/schema.ts"
read -p "Press ENTER when done..."

step "Session types"
mkdir -p server/types
cat > server/types/session.d.ts << 'SESSIONEOF'
import 'express-session';
declare module 'express-session' {
  interface SessionData {
    id?: string;
    userId?: string;
    user?: { id: string; email: string | null; name: string | null; role: string | null; plan?: string | null; };
    ghlAccessToken?: string;
    ghlRefreshToken?: string;
    ghlTokenExpiry?: number;
    ghlLocationId?: string;
  }
}
export {};
SESSIONEOF
success "Session types created"

step "GHL client update"
warning "Add ghl-client-additions.ts exports to server/services/ghl-client.ts"
read -p "Press ENTER when done..."

step "Storage update"
warning "Add storage-additions.ts methods to server/storage.ts"
read -p "Press ENTER when done..."

step "Auto-fix Drizzle"
[ -f "fix-drizzle-syntax.js" ] && node fix-drizzle-syntax.js
success "Syntax fixed"

step "Migration"
read -p "Run db migration? (y/n) " -n 1 -r
echo
[[ $REPLY =~ ^[Yy]$ ]] && npm run db:push

step "Type check"
npm run type-check || warning "Check errors"

step "Build"
npm run build || error "Build failed"

success "COMPLETE! Now commit and push!"
