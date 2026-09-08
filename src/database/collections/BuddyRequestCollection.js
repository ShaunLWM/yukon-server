import Collection from '../Collection'


export default class BuddyRequestCollection extends Collection {

    constructor(user, models) {
        super(user, models, 'buddyRequests', 'senderId')
    }

    add(id) {
        super.add({ senderId: id, recipientId: this.user.id })
    }

    toJSON() {
        let requests = []

        for (let request in this.collection) {
            let user = this.collection[request].user
            let username = user?.username

            requests.push({ id: parseInt(request), username: username, seen: this.collection[request].seen })
        }

        return requests
    }

}
