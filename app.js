const express = require('express');
// 路径处理模块
const path = require('path')
const formidable = require('formidable');


// 创建web服务器
const app = express();

// 暴露资源
app.use(express.static(path.join(__dirname, 'public')))

// 设置跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post('/upload', (req, res) => {
    // 创建formidable表单解析对象
    const form = new formidable.IncomingForm()
    // 设置上传文件存储路径
    form.uploadDir = path.join(__dirname, 'public', 'uploads')
    // 保留上传文件的后缀名
    form.options.keepExtensions = true;
    // 解析客户端传递过来的FormData对象
    form.parse(req, (err, fields, files) => {
        // 将客户端传递过来的文件地址响应到客户端
        // 因为服务器会限制传递大小
        // 大于200m时会传递失败，返回的是空对象
        // 判断是否为空对象再进行处理渲染图片
                console.log(files)

        if (Object.keys(files).length !== 0) {
            res.send({
                path: 'http://127.0.0.1:3000/uploads/'+files.attrName.newFilename
            })
        } else {
            console.log(req.socket.remoteAddress, req.socket.remotePort + ';上传了超过200m的大文件');
            return;
        }
    })

    console.log('收到请求了，请求路径是：' + req.url)
    console.log('请求我的客户端的地址是：', req.socket.remoteAddress, req.socket.remotePort)

})

app.listen(3000, function () {
    console.log('3000端口启动成功');
})
