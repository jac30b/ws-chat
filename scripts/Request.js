function Request(message, type, user, room){
    this.message = message;
    this.type = type;
    this.user = user;
    this.room = room;
}

Request.isRequest = (obj) => {
    return true;
}

module.exports.Request = Request;