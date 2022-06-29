"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueUsersOnlineByUsername = void 0;
// Helpers
function getUniqueUsersOnlineByUsername(activeUserSessions) {
    return [...new Set(activeUserSessions.map((userSession) => userSession.username))];
}
exports.getUniqueUsersOnlineByUsername = getUniqueUsersOnlineByUsername;
