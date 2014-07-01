window.AW = window.AW||{};
(function(){
/**
 *
 * AW.toast
 * @namespace AW
 *
 * @author 叶清 <yeqing@alipay.com>
 * @version 1.0.0
 * @example toast.show('您的资金已经成功转入！');
 *
 * */

'use strict';

var _toastSetup = {
    /**
     * @description 初始化
     *
     */
    init : function() {
        //是否开启容器，是否在容器内，是否有容器方法，是否有权限
        if(toast.options.callContainer && navigator.userAgent.indexOf('AlipayClient') >= 0){
            this.callBridge.call('checkJSAPI', {
                api: 'toast'
            }, function (result) {
                if(result.available) {
                    this.callContainer();
                }
            });
        } else {
            this.setCSS();
            this.setHTML();
            this.show();
        }
    },
    /**
     * @description 是否第一次设置CSS
     *
     */
    isSetCSS : false,
    /**
     * @description 设置CSS
     *
     */
    setCSS : function() {
        var that = this;
        if(that.isSetCSS) {
            document.querySelector("style[data-amwid=toast]").innerHTML = toast.options.CSS;
        } else {
            var style = document.createElement('style');
            style.dataset.amwid = 'toast';
            style.innerHTML = toast.options.CSS;
            document.head.appendChild(style);
            that.isSetCSS = true;
        };
    },
    /**
     * @description 是否第一次设置HTML
     *
     */
    isSetHTML : false,
    /**
     * @description 设置HTML
     *
     */
    setHTML : function() {
        var HTMLtext = toast.options.HTML.replace('<%toast-type%>', toast.options.type);
            HTMLtext = HTMLtext.replace('<%toast-message%>', toast.options.message);
        if(this.isSetHTML) {
            this.toastDom.innerHTML = HTMLtext;
        } else {
            var toastDom = document.createElement('div');
            toastDom.className = 'am-toast am-toast-hide';
            toastDom.innerHTML = HTMLtext;
            this.toastDom = toastDom;
            document.body.appendChild(toastDom);
            this.isSetHTML = true;
        }
    },
    /**
     * @description 显示toast
     *
     */
    show : function() {
        var that = this;
        this.hide();
        that.toastDom.classList.remove('am-toast-hide');
        that.toastDom.classList.add('am-toast-show');
        that.hideDelay();
        return toast;
    },
    /**
     * @description 隐藏toast
     *
     */
    hide : function() {
        clearTimeout(this.hideDelayTimeout);
        if(this.toastDom) {
            this.toastDom.classList.remove('am-toast-show');
            this.toastDom.classList.add('am-toast-hide');
        }
    },
    hideDelayTimeout : {},
    /**
     * @description 延时隐藏toast
     *
	 * //todo 应该是 延迟显示的含义
     */
    hideDelay : function() {
        var that = this;
        if(toast.options.hideDelay != 0){
            that.hideDelayTimeout = window.setTimeout(function(){
                that.hide();
            }, toast.options.hideDelay);
        }
    },
    /**
     * @description 判断容器
     *
     */
    callBridge : function () {
        var args = arguments,
            bridge = window.AlipayJSBridge;
        bridge ? bridge.call.apply(bridge, args) : document.addEventListener("AlipayJSBridgeReady", function () {
            bridge.call.apply(bridge, args);
        }, !1);
    },
    /**
     * @description 调用容器
     *
     */
    callContainer : function () {
        if (toast.options.type === 'success' || toast.options.type === 'error') {
            //fix 容器参数不
            if (toast.options.type === 'error') {
                toast.options.type = 'fail';
            }
            //执行容器toast
            this.callBridge.call('toast', {
                content: toast.options.message,
                type: toast.options.type,
                duration: toast.options.hideDelay
            });
        };
    }
}

/**
 * @desc        基本调用方法
 * @param       {string|object}    options      调用API参数
 *
 * @memberof    AW.toast
 */
var toast = {}
/**
 * @description 默认配置参数
 *
 * @param {String} message - 默认文案
 * @param {String} type - 类型（none | success | error）
 * @param {String} hideDelay - 延迟隐藏时间（毫秒）
 * @param {Boolean} callContainer - 是否开启容器native调用
 *
 * @desc 默认配置参数
 *
 */
toast.options = {
    'message': '',
    'type': 'none',
    'hideDelay': '2500',
    'callContainer': true,
    'HTML': '<div class="am-toast-text"><span class="am-icon-<%toast-type%>"></span> <%toast-message%></div>',
    'CSS': '.am-toast{position:fixed;z-index:100;top:45%;width:100%;text-align:center;font-size:16px;font-family:sans-serif;}.am-toast .am-toast-text{display:inline-block;margin:-24px auto auto;padding:9px 20px;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;-webkit-background-clip:padding-box;color:#FFF;background-color:rgba(0,0,0,0.8);}.am-toast .am-toast-text .iconfont{font-size:16px;}.am-toast-show{display:block;}.am-toast-hide{display:none;}.am-toast .am-icon-error,.am-toast .am-icon-success{display:inline-block;height:15px;vertical-align:middle;}.am-toast .am-icon-error:before,.am-toast .am-icon-success:before{content:"";display:block;width:100%;height:100%;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAUCAYAAADLP76nAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQzM4RDk3M0NEMzkxMUUzOTA5QkQ5NjEwMTU4QkI2MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQzM4RDk3NENEMzkxMUUzOTA5QkQ5NjEwMTU4QkI2MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJDMzhEOTcxQ0QzOTExRTM5MDlCRDk2MTAxNThCQjYwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJDMzhEOTcyQ0QzOTExRTM5MDlCRDk2MTAxNThCQjYwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wRxj8gAAAclJREFUeNrEl79KxEAQxnPnO9gJhwgWiiDKgeIf0HdI7OysLA4ULxbqNVd4gmBhJVrY6UP4AL6BIIp4WFxQVLSTi9/iHKzrJNnZcHHgl4RkJvt9kOzsluI49ijq4B5cerLwQQW0vP8IZQCE8U98AZ/u2eBTjYq6oE7KAFij869nHg2sh60JXXwvtvogvgRO6f3npgl1WGGEZJnwE2qCPog/McY5A2XdgNREkeKP479xCwZNA7YmihR/xIi/A0PmJ2RroijxikNG/AOocD+xrQmp+Bo4cBDfYsQ/gmEuP+klnAmJ+HXQpdymQHyTGasNRpJq0l4WJJjIEr+qie9Fw0J8gxnrCYym1ZXTepzjs2sQGff2wG5KzQ7l6NEBy+DGphPbTJWSPjEGOkxdyOSGTJ6qHbf57CRNStrsJkDEiNvUcjaY5xHVei4GgpTZJnAwMQmeGZE1wowXqvFcDAQWU6WLiSnwatR0mR9d5UxLp12J+DwmqowJU3zVpelJxecxMQPeGPHvYNa1a3OzgO3ygDORtSeYAx9avrqez7Ps6F1sO65tdBOhZc0C+CQW866bStqWMqQt5YVwUxfQlnJfULNE56u8O8pvAQYAUnCy4ged31IAAAAASUVORK5CYII=") no-repeat;-webkit-background-size:32px auto;}.am-toast .am-icon-error{width:13px;}.am-toast .am-icon-error:before{background-position:0 0;}.am-toast .am-icon-success{width:16px;}.am-toast .am-icon-success:before{background-position:-14px 0;}'
}
/**
 * @desc        显示toast
 *
 * @memberof    AW
 */
toast.show = function (options){
    if(typeof(options) === 'undefined') {
        _toastSetup.show();
    } else {
        //对象 参数覆盖
        if(typeof(options) === 'object') {
            for(var p in options){
                this.options[p] = options[p];
            }
        }
        //字符串 直接替换message
        else if(typeof(options) === 'string') {
            this.options.message = options;
        }
        _toastSetup.init();
    }
}
/**
 * @desc        隐藏toast
 * @param       {string}    message         提示的文案
 *
 * @memberof    AW
 */
toast.hide = function (message){
    _toastSetup.hide();
}


window.AW.toast = toast;
})();