# cocos_tools
cocos工具集
全局修改图片格式

# 需要安装node环境
https://nodejs.org/en

# 使用方法
把imageformat.js拷贝到你的工程根目录下，
打开imageformat.js文件，修改为你需要的配置
```javascript
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
```
执行命令 node imageformat.js，
一键修改工程里面图片的格式配置文件

# 给我点赞
如果你觉得有用，请给我点小星星，这样我才有动力开发更多实用的功能
