// 适配项目一些文件处理
const fs = require("fs");
const path = require("path");
const { outPut } = require("./url.js");

const _path = path.resolve(__dirname, `${outPut}`);

// 将html后缀改为jsp
fs.readdir(_path, function(err, files){
    console.log(files)
    if(err) { return };

    files.forEach(function(filename){
        if(filename.match(/.html/g)){
            var oldPath = _path + '/' + filename,
            newPath = _path + '/' + filename.replace(/.html/g, '.jsp')
    
            fs.rename(oldPath, newPath, function(err) {
                if (!err) {
                    console.log(filename + '  文件名后缀修改成功!')
                } 
            })
        }

    })
});