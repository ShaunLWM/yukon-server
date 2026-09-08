import GamePlugin from '@plugin/GamePlugin'

import { isNumber } from '@utils/validation'


export default class FavoriteItem extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'favorite_item': this.favoriteItem
        }
    }

    favoriteItem(args, user) {
        if (!isNumber(args.item)) return
        if (!user.inventory.includes(args.item)) return

        const isFavorite = user.favoriteItems.includes(args.item)

        if (isFavorite) {
            user.favoriteItems.remove(args.item)
        } else {
            user.favoriteItems.add(args.item)
        }

        user.send('favorite_item', { item: args.item, favorite: !isFavorite })
    }

}
