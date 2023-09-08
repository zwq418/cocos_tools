const fs = require('fs');
const path = require('path');
const dirPath = path.resolve('.');

// 需要修改内容的目录
const DIR_PATH = 'assets/';
// 需要修改内容的后缀
const FILE_EXT = '.meta';
// 需要修改的图片类型，[]表示所有，['.pac', '.png', '.jpg']包含.pac（自动图集)、png、jpg格式
const IMAGE_TYPES = ['.pac', '.png', '.jpg'];
// 需要排除的同名类型，[]表示不排除，['.json']不修改含json后缀的同名文件，例如spine、龙骨
const EXCLUSIVE_EXTS = ['.json'];
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

function removeExt(fileName) {
    return fileName.substring(0, fileName.lastIndexOf('.'))
}

function filterImageType(file) {
    if (!path.extname(file.name) === FILE_EXT) {
        return false;
    }

    if (IMAGE_TYPES && IMAGE_TYPES.length > 0) {
        const fileName = removeExt(file.name);
        if (!IMAGE_TYPES.find(type => path.extname(fileName) === type)) {
            return false;
        }
    }

    if (EXCLUSIVE_EXTS && EXCLUSIVE_EXTS.length > 0) {
        const fileName = removeExt(removeExt(file.name));
        if (EXCLUSIVE_EXTS.find(ext => fs.existsSync(file.path + '/' + fileName + ext))) {
            console.log('EXCLUSIVE_EXTS', fileName);
            return false;
        }
    }
    return true;
}

const targetExtFilePaths = [];
walkSync(inputPath, file => {
    return filterImageType(file);
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