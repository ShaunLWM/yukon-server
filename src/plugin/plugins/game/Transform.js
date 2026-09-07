import GamePlugin from '@plugin/GamePlugin'

import { isNumber } from '@utils/validation'


export default class Transform extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'transform_player': this.transformPlayer,
            'revert_transform': this.revertTransform
        }
    }

    transformPlayer(args, user) {
        if (!isNumber(args.transform)) return

        const ownsItem = Object.entries(this.crumbs.items).some(([itemId, item]) =>
            item.type === 11 && item.transform === args.transform && user.inventory.includes(Number(itemId))
        )
        if (!ownsItem) return

        user.transform = args.transform
        user.update({ transform: args.transform })
        user.room.send(user, 'transform_player', { id: user.id, transform: args.transform }, [])
    }

    revertTransform(args, user) {
        user.transform = 0
        user.update({ transform: 0 })
        user.room.send(user, 'transform_player', { id: user.id, transform: 0 }, [])
    }

}
