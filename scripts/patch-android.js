import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const androidDir = path.join(projectRoot, 'android');

if (!fs.existsSync(androidDir)) {
  // Android platform not added yet on this environment
  process.exit(0);
}

console.log('Automating Android configuration and fixes...');

// 1. Fix app/build.gradle (proguard-android-optimize.txt deprecation)
const appBuildGradlePath = path.join(androidDir, 'app', 'build.gradle');
if (fs.existsSync(appBuildGradlePath)) {
  let content = fs.readFileSync(appBuildGradlePath, 'utf8');
  if (content.includes("'proguard-android.txt'")) {
    content = content.replace(/'proguard-android\.txt'/g, "'proguard-android-optimize.txt'");
    fs.writeFileSync(appBuildGradlePath, content, 'utf8');
    console.log('✔ Patched app/build.gradle with proguard-android-optimize.txt');
  }
}

// 2. Fix AndroidManifest.xml (Camera permissions)
const manifestPath = path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, 'utf8');
  const cameraPerms = `
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />`;

  if (!content.includes('android.permission.CAMERA')) {
    content = content.replace('<application', `${cameraPerms}\n    <application`);
    console.log('✔ Added camera permissions to AndroidManifest.xml');
  }

  // Ensure cleartext HTTP is permitted for local network and adb connections (http://192.168.x.x or http://localhost:3000)
  if (!content.includes('android:usesCleartextTraffic="true"')) {
    content = content.replace('<application', '<application android:usesCleartextTraffic="true"');
    console.log('✔ Enabled usesCleartextTraffic in AndroidManifest.xml');
  }

  // Create network_security_config.xml to explicitly allow cleartext to all local hosts
  const xmlDir = path.join(androidDir, 'app', 'src', 'main', 'res', 'xml');
  if (!fs.existsSync(xmlDir)) {
    fs.mkdirSync(xmlDir, { recursive: true });
  }
  const netSecPath = path.join(xmlDir, 'network_security_config.xml');
  const netSecContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
`;
  fs.writeFileSync(netSecPath, netSecContent, 'utf8');
  if (!content.includes('android:networkSecurityConfig=')) {
    content = content.replace('<application', '<application android:networkSecurityConfig="@xml/network_security_config"');
    console.log('✔ Linked networkSecurityConfig in AndroidManifest.xml');
  }

  fs.writeFileSync(manifestPath, content, 'utf8');
}

// 3. Fix MainActivity.java so it never crashes with NullPointer or ClassNotFound
function findAndFixMainActivity(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findAndFixMainActivity(fullPath);
    } else if (entry.name === 'MainActivity.java') {
      let code = fs.readFileSync(fullPath, 'utf8');
      // Find the existing package declaration
      const packageMatch = code.match(/package\s+([a-zA-Z0-9_.]+);/);
      if (packageMatch) {
        const packageName = packageMatch[1];
        // Clean, standard crash-proof BridgeActivity without fragile bridge calls
        const cleanMainActivity = `package ${packageName};

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
`;
        fs.writeFileSync(fullPath, cleanMainActivity, 'utf8');
        console.log(`✔ Restored clean, crash-proof MainActivity.java for package ${packageName}`);
      }
    }
  }
}

const javaDir = path.join(androidDir, 'app', 'src', 'main', 'java');
if (fs.existsSync(javaDir)) {
  findAndFixMainActivity(javaDir);
}

console.log('✔ All Android patches applied successfully.');
