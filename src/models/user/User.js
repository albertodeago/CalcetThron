const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/darthron-6a632.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=ebd85bb5-b11c-4ca9-b7d3-4fab14d56d88"

export default class User {
    constructor({ id, nickname, creationDate = new Date().getTime(), email, lastLogin = new Date().getTime(), lastUpdate = new Date().getTime(), password, avatar = defaultAvatar }) {
        this.id = id
        this.nickname = nickname
        this.creationDate = creationDate
        this.email = email
        this.lastLogin = lastLogin
        this.lastUpdate = lastUpdate
        this.password = password
        this.avatar = avatar
    }

    toJSON() {
        return {
            id: this.id,
            nickname: this.nickname,
            creationDate: this.creationDate,
            email: this.email,
            lastLogin: this.lastLogin,
            lastUpdate: this.lastUpdate,
            password: this.password,
            avatar: this.avatar
        }
    }
}

export { User }