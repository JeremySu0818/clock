const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
};

if (process.platform === 'win32') {
  run('cmd.exe', ['/d', '/s', '/c', path.join(__dirname, 'build-installer.bat')]);
}

if (process.platform === 'darwin' || process.platform === 'linux') {
  run('sh', [path.join(__dirname, 'build-installer.sh')]);
}

console.error(`Unsupported platform: ${process.platform}`);
process.exit(1);
