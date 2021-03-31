function AsyncTask(data) {
    this.root = data.root ? data.root : '';
    this.path = this.root + data.path;
    this.param = data.param;
    this.timeout = data.timeout ? data.timeout : 20000;
    console.log(data.path)
}

AsyncTask.prototype = {
    constructor: AsyncTask,
    get: async function () {
        var self = this;
        var task = new Promise(function (resolve, reject) {
            var dataStr = [];
            for (var k in self.param) {
                dataStr.push(k + '=' + encodeURIComponent(self.param[k]));
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', self.path + (dataStr.length > 0 ? '?' + dataStr.join('&') : ''));
            xhr.onload = function () {
                console.log(this.responseText);
                var result = false;
                try {
                    result = JSON.parse(this.responseText);
                } catch (e) {
                }
                resolve(result || 'Invalid response from server');
            };
            xhr.ontimeout = function (e) {
                resolve('timeout');
            }
            xhr.timeout = self.timeout;
            xhr.send(dataStr.join('&'));
        });
        try {
            var result = await task;
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    post: async function () {
        var self = this;
        var task = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', self.path, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Access-Control-Allow-Origin,Access-Control-Allow-Methods');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.onload = function () {
                console.log(this.responseText);
                var result = false;
                try {
                    result = JSON.parse(this.responseText);
                } catch (e) {
                }
                resolve(result || 'Invalid response from server');
            };
            var dataStr = [];
            for (var k in self.param) {
                dataStr.push(k + '=' + encodeURIComponent(self.param[k]));
            }
            xhr.ontimeout = function (e) {
                resolve('timeout');
            }
            xhr.timeout = self.timeout;
            xhr.send(dataStr.join('&'));
        });
        try {
            var result = await task;
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    submitForm: async function () {
        var self = this;
        var task = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', self.path, true);
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Access-Control-Allow-Origin,Access-Control-Allow-Methods');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.onload = function () {
                console.log(this.responseText);
                var result = false;
                try {
                    result = JSON.parse(this.responseText);
                } catch (e) {
                }
                resolve(result || 'Invalid response from server');
            }
            var formData = new FormData();
            for (var k in self.param) {
                //console.log(k)
                //console.log(self.param[k])
                formData.append(k, self.param[k]);
            }

            xhr.ontimeout = function (e) {
                resolve('timeout');
            }
            xhr.timeout = self.timeout;
            console.log(xhr.timeout)
            xhr.send(formData);
        });
        try {
            var result = await task;
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
}