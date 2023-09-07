const fs = require('fs');
const path = require('path');
const dirPath = path.resolve('.');

// 需要修改内容的目录
const DIR_PATH = 'assets/';
// 需要修改内容的文件
const FILE_EXT = '.meta';
// 需要替换的属性
const REPLACE_KEY = 'platformSettings';
// 替换后的内容
const REPLACE_VALUE = {
    "default": {
      "formats": [
        {
          "name": "webp",
          "quality": 80
        }
      ]
    }
  }


const inputPath = dirPath + '/' + DIR_PATH;

function walkSync(dirPath, compare, callback) {
    fs.readdirSync(dirPath, { withFileTypes: true }).forEach(file => {
        const filePath = path.join(dirPath, file.name);
        if (file.isFile()) {
            if (compare(file)) {
                callback(filePath);
            }
        } else if (file.isDirectory()) {
            walkSync(filePath, compare, callback)
        }
    })
}

const targetExtFilePaths = [];
walkSync(inputPath, file => {
    return path.extname(file.name) === FILE_EXT;
}, jsonPath => {
    targetExtFilePaths.push(jsonPath);
})

console.log('targetExtFilePaths', targetExtFilePaths.length);

let repalceFileCount = 0;
function readFile() {
    targetExtFilePaths.forEach(path => {
        const fileContent = fs.readFileSync(path, 'utf-8');
        if (fileContent.includes(REPLACE_KEY)) {
            console.log('replaceFile', path)
            const json = JSON.parse(fileContent);
            json[REPLACE_KEY] = REPLACE_VALUE;
            fs.writeFileSync(path, JSON.stringify(json, null, "  "));
            repalceFileCount += 1;
        }
    })
    console.log('repalceFileCount:', repalceFileCount);
}

readFile();