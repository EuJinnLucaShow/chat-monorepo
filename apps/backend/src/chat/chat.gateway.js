"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var ChatGateway = function () {
    var _classDecorators = [(0, common_1.Injectable)(), (0, websockets_1.WebSocketGateway)({
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                credentials: true,
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var _handleJoinRoom_decorators;
    var ChatGateway = _classThis = /** @class */ (function () {
        function ChatGateway_1(supabaseService) {
            this.supabaseService = (__runInitializers(this, _instanceExtraInitializers), supabaseService);
            this.server = __runInitializers(this, _server_initializers, void 0);
            this.connectedUsers = (__runInitializers(this, _server_extraInitializers), new Map());
        }
        ChatGateway_1.prototype.handleConnection = function (client) {
            console.log("Client connected: ".concat(client.id));
        };
        ChatGateway_1.prototype.handleDisconnect = function (client) {
            console.log("Client disconnected: ".concat(client.id));
            for (var _i = 0, _a = this.connectedUsers.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value.socketId === client.id) {
                    this.connectedUsers.delete(key);
                    // Повідомляємо про від'єднання
                    if (value.currentRoom) {
                        client.to(value.currentRoom).emit('user_left', {
                            userId: value.userId,
                            message: "".concat(value.profile.username, " \u043F\u043E\u043A\u0438\u043D\u0443\u0432 \u043A\u0456\u043C\u043D\u0430\u0442\u0443"),
                        });
                    }
                    break;
                }
            }
        };
        ChatGateway_1.prototype.handleJoinRoom = function (data, client) {
            return __awaiter(this, void 0, void 0, function () {
                var roomId, userId, profile, messages, onlineUsers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roomId = data.roomId, userId = data.userId, profile = data.profile;
                            return [4 /*yield*/, client.join(roomId)];
                        case 1:
                            _a.sent();
                            this.connectedUsers.set(userId, {
                                socketId: client.id,
                                userId: userId,
                                profile: profile,
                                currentRoom: roomId,
                            });
                            return [4 /*yield*/, this.supabaseService.getMessages(roomId)];
                        case 2:
                            messages = _a.sent();
                            client.emit('room_messages', messages);
                            onlineUsers = Array.from(this.connectedUsers.values())
                                .filter(function (user) { return user.currentRoom === roomId; })
                                .map(function (user) { return user.profile; });
                            this.server.to(roomId).emit('online_users', onlineUsers);
                            client.to(roomId).emit('user_joined', {
                                userId: userId,
                                username: profile.username,
                                message: "".concat(profile.username, " \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u0432\u0441\u044F \u0434\u043E \u043A\u0456\u043C\u043D\u0430\u0442\u0438"),
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ChatGateway_1;
    }());
    __setFunctionName(_classThis, "ChatGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleJoinRoom_decorators = [(0, websockets_1.SubscribeMessage)('join_room')];
        __esDecorate(_classThis, null, _handleJoinRoom_decorators, { kind: "method", name: "handleJoinRoom", static: false, private: false, access: { has: function (obj) { return "handleJoinRoom" in obj; }, get: function (obj) { return obj.handleJoinRoom; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatGateway = _classThis;
}();
exports.ChatGateway = ChatGateway;
