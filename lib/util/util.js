"use strict";

var _ = require('lodash');

_.mixin({
    pickObjectParams: function (data, params) {

        params = Array.prototype.slice.call(arguments, 1);

        return _.map(data, function (item) {
            return _.pick.apply(_, [item].concat(params));
        });
    },
    omitObjectParams: function (datam, params) {

        params = Array.prototype.slice.call(arguments, 1);

        return _.map(data, function (item) {
            return _.omit.apply(_, [item].concat(params));
        });

    },
    stripHtml: function (str) {

        return str.replace(/<(?:.|\n)*?>/gm, '');

    },
    timeAgoDate: function (time) {
        var date = new Date(time),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0)
            return;

        return day_diff == 0 && (
            diff < 60 && "just now" ||
                diff < 120 && "1 minute ago" ||
                diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
            day_diff == 1 && "Yesterday" ||
            day_diff < 7 && day_diff + " days ago" ||
            day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago" ||
            day_diff < 365 && Math.ceil(day_diff / 30) + " mounts ago" ||
            day_diff > 365 && Math.floor(day_diff / 365) + " years ago";
    },

    getImageFromContent: function (str) {
        var image = str.match(/<img.+?src=["'](.+?)["'].+?>/)

        return image ? image[1] : "";
    },
    addhttp: function (url) {
        if (!/^(f|ht)tps?:\/\//i.test(url)) {
            url = "http://" + url;
        }
        return url;
    },
    truncate: function(str, length, truncateStr){
        if (str == null) return '';
        str = String(str); truncateStr = truncateStr || '...';
        length = ~~length;
        return str.length > length ? str.slice(0, length) + truncateStr : str;
    }
})
;

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
