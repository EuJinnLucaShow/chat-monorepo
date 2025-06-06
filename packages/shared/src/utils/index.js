"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateText = exports.validateUsername = exports.validateEmail = exports.formatFileSize = exports.formatDate = exports.formatTime = void 0;
var formatTime = function (timestamp) {
    return new Date(timestamp).toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
exports.formatTime = formatTime;
var formatDate = function (timestamp) {
    return new Date(timestamp).toLocaleDateString('uk-UA');
};
exports.formatDate = formatDate;
var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
exports.formatFileSize = formatFileSize;
var validateEmail = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
var validateUsername = function (username) {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
};
exports.validateUsername = validateUsername;
var truncateText = function (text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
exports.truncateText = truncateText;
