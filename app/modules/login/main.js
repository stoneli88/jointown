require('./main.scss');

// 手动赋值到window对象上面，解决kendo无法识别jQuery的问题。
var $ = window.jQuery = require('jquery');
var PATH = require('../constants').PATH;

var kendo = require('kendo.binder');
require('jqBackstretch');

// 创建登录VM对象
var loginVM = kendo.observable({
    username: "",
    upassword: "",
    login: function(e) {
        e.preventDefault();
        alert("你很忙好, " + this.username + " !!!"); 
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



