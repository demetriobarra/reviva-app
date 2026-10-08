#!/usr/bin/env bash
# Cria/ajusta o projeto iOS do ReViva (rodado no Codemagic ou num Mac).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build:web
[ -d ios ] || npx cap add ios
PBX=ios/App/App.xcodeproj/project.pbxproj
PLIST=ios/App/App/Info.plist
# Só iPhone (sem iPad)
sed -i.bak 's/TARGETED_DEVICE_FAMILY = "1,2";/TARGETED_DEVICE_FAMILY = 1;/' "$PBX" && rm -f "$PBX.bak"
# Ajustes do Info.plist
pb() { /usr/libexec/PlistBuddy -c "$1" "$PLIST" 2>/dev/null || true; }
pb "Set :CFBundleDevelopmentRegion pt-BR"
pb "Set :CFBundleDisplayName ReViva"
pb "Delete :UISupportedInterfaceOrientations"
pb "Add :UISupportedInterfaceOrientations array"
pb "Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationPortrait"
pb "Add :ITSAppUsesNonExemptEncryption bool false"
pb "Add :UIUserInterfaceStyle string Light"
# Ícone e tela de abertura
npx capacitor-assets generate --ios --iconBackgroundColor '#FBF7F2' --splashBackgroundColor '#FBF7F2'
npx cap sync ios
echo "iOS pronto."
