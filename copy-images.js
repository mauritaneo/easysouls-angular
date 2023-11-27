const fs = require('fs');
const path = require('path');

const sourceDir = '/opt/lampp/htdocs/easysouls/wp-content/uploads';
const targetDir = 'src/images';

function copyImages(sourceDir, targetDir) {
  fs.readdirSync(sourceDir, { withFileTypes: true }).forEach(dirent => {
    const sourcePath = path.join(sourceDir, dirent.name);
    if (dirent.isDirectory()) {
      copyImages(sourcePath, targetDir);
    } else if (dirent.isFile() && /\.(jpg|jpeg|png|gif)$/.test(dirent.name)) {
      const targetPath = path.join(targetDir, dirent.name);
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

copyImages(sourceDir, targetDir);