import GamePlugin from '@plugin/GamePlugin'

import { hasProps } from '@utils/validation'


export default class Buddy extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'buddy_request': this.buddyRequest,
            'buddy_accept': this.buddyAccept,
            'buddy_reject': this.buddyReject,
            'buddy_remove': this.buddyRemove,
            'buddy_find': this.buddyFind,
            'buddy_request_seen': this.buddyRequestSeen,
            'buddy_favorite': this.buddyFavorite,
            'buddy_search': this.buddySearch
        }
    }

    buddyRequest(args, user) {
        let recipient = this.usersById[args.id]

        if (!recipient) {
            return
        }

        if (recipient.id == user.id) {
            return
        }

        if (recipient.buddyRequests.includes(user.id)) {
            return
        }

        if (recipient.buddies.includes(user.id)) {
            return
        }

        if (recipient.ignores.includes(user.id)) {
            return
        }

        recipient.buddyRequests.add(user.id)
        recipient.send('buddy_request', { id: user.id, username: user.username })
    }

    async buddyAccept(args, user) {
        if (!hasProps(args, 'id')) {
            return
        }

        if (!(user.buddyRequests.includes(args.id))) {
            return
        }

        if (user.buddies.includes(args.id)) {
            return
        }

        user.clearBuddyRequest(args.id)

        let requester = this.usersById[args.id]
        let username

        if (requester) {
            username = requester.username
            requester.addBuddy(user.id, user.username, true)

        } else {
            username = await this.db.getUsername(args.id)
            this.db.buddies.create({ userId: args.id, buddyId: user.id })
        }

        user.addBuddy(args.id, username)
    }

    buddyReject(args, user) {
        if (!hasProps(args, 'id')) {
            return
        }

        user.buddyRequests.remove(args.id)
        user.send('buddy_reject', { id: args.id })
    }

    buddyRequestSeen(args, user) {
        if (!hasProps(args, 'id')) {
            return
        }

        if (!user.buddyRequests.includes(args.id)) {
            return
        }

        this.db.buddyRequests.update(
            { seen: 1 },
            { where: { senderId: args.id, recipientId: user.id } }
        )
    }

    buddyRemove(args, user) {
        if (!user.buddies.includes(args.id)) {
            return
        }

        user.removeBuddy(args.id)

        let buddy = this.usersById[args.id]

        if (buddy) {
            buddy.removeBuddy(user.id)
        } else {
            this.db.buddies.destroy({ where: { userId: args.id, buddyId: user.id } })
        }
    }

    buddyFind(args, user) {
        if (!user.buddies.includes(args.id) || !(args.id in this.usersById)) {
            return
        }

        let buddy = this.usersById[args.id]

        if (!buddy.room) {
            return
        }

        let result = { find: buddy.room.id }

        if (buddy.room.isIgloo) {
            result.igloo = true
        } else if (buddy.room.game) {
            result.game = true
        }

        user.send('buddy_find', result)
    }

    buddyFavorite(args, user) {
        if (!hasProps(args, 'id')) return
        if (!user.buddies.includes(args.id)) return

        let buddy = user.buddies.get(args.id)
        let favorite = !buddy.favorite

        user.buddies.setFavorite(args.id, favorite)
        user.send('buddy_favorite', { id: args.id, favorite: favorite })
    }

    async buddySearch(args, user) {
        if (!args.search || typeof args.search !== 'string') return

        let search = args.search.trim()
        if (search.length < 3 || search.length > 12) return

        let result = await this.db.users.findOne({
            where: { username: search },
            attributes: ['id', 'username']
        })

        if (!result) {
            user.send('buddy_search', { penguin: null })
            return
        }

        let isBuddy = user.buddies.includes(result.id)
        user.send('buddy_search', {
            penguin: { id: result.id, username: result.username, isBuddy: isBuddy }
        })
    }

}
