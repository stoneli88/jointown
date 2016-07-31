require('./main.scss');

// 手动赋值到window对象上面，解决kendo无法识别jQuery的问题。
var $ = window.jQuery = require('jquery');
var PATH = require('../constants').PATH;

var kendo = require('kendo.binder');
require('jqBackstretch');

// 登录
var doLogin = function(username, password) {
    return $.ajax({
        method: 'POST',
        url: '/operator/BSlogin',
        dataType: 'json',
        data: {
            loginName: username,
            password: password
        }
    })
};

// 创建登录VM对象
var loginVM = kendo.observable({
    username: "",
    upassword: "",
    login: function (e) {
        e.preventDefault();
        doLogin(this.username, this.upassword).done(function(ret) {
            console.log(ret.msg);
        });
        return false;
    }
});

$(function () {
    $.backstretch(
        [
            PATH.IMG_PATH + "media/image/bg/1.jpg",
            PATH.IMG_PATH + "media/image/bg/2.jpg",
            PATH.IMG_PATH + "media/image/bg/3.jpg",
            PATH.IMG_PATH + "media/image/bg/4.jpg"
        ],
        {
            fade: 1000,
            duration: 1000
        }
    );

    kendo.bind($(".boss-login-form"), loginVM);
});



