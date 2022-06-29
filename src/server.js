"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path1 = __importDefault(require("path"));
const http = __importStar(require("http"));
const socketio = __importStar(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const utilities_1 = require("./utilities");
const config_1 = require("./config");
const app = (0, express_1.default)();
// http sunucusunu ve soket sunucusunu kurun
const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: config_1.CLIENT_HOST,
        credentials: true,
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
// =======================================================================================
// (Geçici) veri kalıcılığı için bellek depolama
// =======================================================================================
let messages = [];
let users = [];
let activeUserSessions = [];
// =====================================================================================
// İlk oturum açmada tüm mesaj ve kullanıcı verilerine erişmek için API yolları
// =====================================================================================
app.get('/api/messages', (request, response) => {
    response.send({ messages });
});
app.get('/api/users', (request, response) => {
    response.send({ users });
});
// =====================================================================================
// Socket.io örneği
// =====================================================================================
io.on('connection', (socket) => {
    const { id } = socket.client;
    console.log(`Yeni Müşteri Katıldı Işte Id'si: *${id}*`);
    // =====================================================================================
    // Yeni giriş
    // =====================================================================================
    socket.on('new login', (user) => {
        console.log(`Şu Anda *${user.username}* Isimli Kullanıcı Sohbet'e Bağlandı!`);
        // Yeni oturum açma bilgilerini tüm kullanıcılar listesine ekleyin
        if (!users.some((existingUser) => existingUser.username === user.username)) {
            users = [...users, user];
            io.emit('new user added', user);
        }
        // Geçerli kullanıcı adı/oturum kombinasyonunu kaydedin
        socket.sessionUsername = user.username;
        activeUserSessions.push({
            session: id,
            username: user.username,
        });
        io.emit('users online', (0, utilities_1.getUniqueUsersOnlineByUsername)(activeUserSessions));
    });
    // =====================================================================================
    // Mesaj gönder
    // =====================================================================================
    socket.on('send message', (message) => {
        console.log(`Mesaj Gönderen: *${message.author}*! Mesajı: *${message.content}*!`);
        messages.push(message);
        io.emit('receive message', message);
    });
    // =====================================================================================
    // Bağlantıyı Kes
    // =====================================================================================
    socket.on('disconnect', () => {
        console.log(`Bu *${socket.sessionUsername}* Kullanıcı'nın Bağlantısı Kesildi!`);
        // Geçerli oturumu kaldır
        // Aynı kullanıcının birden fazla istemci oturumu açık olabilir, bu da yanlış görüntülemeyi önler
        activeUserSessions = activeUserSessions.filter((user) => !(user.username === socket.sessionUsername && user.session === id));
        io.emit('users online', (0, utilities_1.getUniqueUsersOnlineByUsername)(activeUserSessions));
    });
});
app.set('port', config_1.PORT);
// Sunucuyu başlat
server.listen(config_1.PORT, () => {
    console.log(`Server Şu Anda Bu *${config_1.PORT}'da* Dinlemeye Alındı! Varsayılan Port:*:5000`);
});
