// 此node脚本主要是将webpack打包后的文件，按照filesConfig.js的配置再次构建到指定的目录下，同时删除上次的文件以及将html文件后缀改为jsp

const fs = require("fs");
const path = require("path");
const catalog = require("./filesConfig.js");
const { outPut, fileName } = require("./url");

const filePath = "../../src/main/webapp/webpage/com/hitek";

for(let _path in catalog){
    fs.readdir(path.resolve(__dirname, outPut), function(err, files){
        if(err){
            console.log("构建目录出现异常");
            return;
        }

        if(files){
            for(let i=0;i<catalog[_path].length;i++){
                let _filename = catalog[_path][i];
                for(let j=0;j<files.length;j++){
                    if(files[j].indexOf(`${_filename}.`) != -1){
                        fs.unlink(path.resolve(__dirname, `${filePath}${_path}/${files[j]}`), (err)=>{
                            if(err){
                                return;
                            }
                        })
                    }
                }
            }
        }

        fs.readdir(path.resolve(__dirname, outPut), function(err, files){
            if(err) { return };
        
            for(let i=0;i<catalog[_path].length;i++){
                let _filename = catalog[_path][i];
                for(let j=0;j<files.length;j++){
                    if(files[j].indexOf(`${_filename}.`) != -1){
                        fs.readFile(path.resolve(__dirname, `${outPut}/${files[j]}`), "utf-8", function(error, data) {
                            if (error) return;
                            
                            var newContent = data;

                            // 替换代码中的路径
                            if(files[j].match(/.html/g)){
                                newContent = newContent.replace(eval(`/${fileName}/g`), `${_path.substr(1, _path.length-1)}`);
                            }

                            var _pathArr = _path.split("/");
                            var _index = 0;

                            function checkFile(){
                                fs.exists(path.resolve(__dirname, `${filePath}/${_pathArr.slice(0, _index+1).join("/")}`), function(exists) {
                                    if(exists){
                                        if(_index == _pathArr.length-1){
                                            // 写入修改路径后的代码
                                            fs.writeFile(path.resolve(__dirname, `${filePath}${_path}/${files[j]}`), newContent, function (err) {
                                                if(err) { 
                                                    console.log("写入文件出错！");
                                                    return
                                                }

                                                // if(files[j].match(/.html/g)){
                                                //     var oldPath = path.resolve(__dirname, `${filePath}${_path}/${files[j]}`),
                                                //     newPath = path.resolve(__dirname, `${filePath}${_path}/${files[j].replace(/.html/g, '.jsp')}`);
                                            
                                                //     fs.rename(oldPath, newPath, function(err) {
                                                //         if (err) {
                                                //             return;
                                                //         } 
                                                //     })
                                                // }
                                            });
                                        }else{
                                            if(_index < _pathArr.length-1){
                                                _index++;
                                                checkFile();
                                            }
                                        }
                                    }else{
                                        if(_index < _pathArr.length-1){
                                            _index++;
                                            fs.mkdir(path.resolve(__dirname, `${filePath}/${_pathArr.slice(0, _index).join("/")}`),function(err){
                                                if (err) {
                                                    return;
                                                }
                                                checkFile();
                                             });
                                        }else{
                                            fs.mkdir(path.resolve(__dirname, `${filePath}/${_pathArr.slice(0, _index+1).join("/")}`),function(err){
                                                if (err) {
                                                    return;
                                                }
                                                fs.writeFile(path.resolve(__dirname, `${filePath}${_path}/${files[j]}`), newContent, function (err) {
                                                    if(err) { 
                                                        console.log("写入文件出错！");
                                                        return
                                                    }
                                                });
                                             });
                                        }
                                    }

                                });
                            }

                            checkFile();


                        });
                    }
                }
            }
        });
    });
}