// 适配项目一些文件处理
const fs = require("fs");
const path = require("path");
const url = "webpage/com/hitek/static/";

const _path = path.resolve(__dirname, "../static");

// 修改js/css引入的路径，适配嵌入到项目中
fs.readdir(_path, function(err, files){
    if(err) { return };

    files.forEach(function(filename){

        if(filename.match(/.jsp/g)){

            fs.readFile(`${_path}/${filename}`, "utf-8", function(error, data) {
                if (error) return;

                var newContent = data;
                newContent = newContent.replace(/<script src="/g, `<script src="${url}`);
                newContent = newContent.replace(/<link rel="stylesheet" href="/g, `<link rel="stylesheet" href="${url}`);

                fs.writeFile(`${_path}/${filename}`, newContent, function (err) {
                    if(err) {
                        console.log(`${filename} js路径修改失败`);
                        return;
                    } else {
                        console.log(`${filename} js路径修改成功`);
                    }
                });

            });
        }
    })
});