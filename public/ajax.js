function ajax(options) {
    // defaults 存储默认值
    var defaults = {
        type: 'get',
        url: '',
        data: {},
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function () { },
        error: function () { }
    }
    // 浅拷贝 (后者内容拷贝给前者)
    Object.assign(defaults, options)
    // 创建ajax对象
    var xhr = new XMLHttpRequest();
    // params 用于拼接请求参数的变量 
    var params = '';

    for (var attr in defaults.data) {
        // 将参数拼接为 name=matsuzaka&age=18的格式
        params += attr + '=' + defaults.data[attr] + '&'
    }
    // 将最后一个 & 符号截取掉
    params = params.substr(0, params.length - 1)

    // 判断请求方式 get
    if (defaults.type == 'get') {
        defaults.url = defaults.url + "?" + params
    }

    // 配置ajax对象(发送方式，请求地址)
    xhr.open(defaults.type, defaults.url)
    // 发送请求
    // 判断请求方式 post
    if (defaults.type == 'post') {
        var contentType = defaults.header['Content-Type']
        // 设置请求参数格式
        xhr.setRequestHeader('Content-Type', contentType)

        // 判断如果数据类型是json的 就把json传递到这里改为字符串
        if (contentType == 'application/json') {
            xhr.send(JSON.stringify(defaults.data))
        } else {
            // 如果不是json类型 就直接输出拼接好的数据
            xhr.send(params)
        }
        // 如果不是 post
    } else {
        xhr.send()
    }
    // 监听xhr 对象下面的onload事件
    // 当xhr对象接受完响应数据后触发
    xhr.onload = function () {

        // 获得响应头的指定数据
        // xhr.getResponseHeader('指定数据')
        var contentType = xhr.getResponseHeader('Content-Type');
        // 服务器端返回的数据
        var responseText = xhr.responseText;

        // includes() 判断一个值是否包含某个数，如果包含返回true
        if (contentType.includes('application/json')) {
            // 将json字符串转换为json对象
            responseText = JSON.parse(responseText)
        }

        // 判断http状态码 =200 时候，就把信息传过去
        if (xhr.status == 200) {
            defaults.success(responseText, xhr); // 这是实参 传递给data
        } else {
            // 发送失败则返回文本信息和xhr对象，xhr对象可以用于查看失败信息
            defaults.error(responseText, xhr)
        }
    }
}