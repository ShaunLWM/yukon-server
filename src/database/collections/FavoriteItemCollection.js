import Collection from '../Collection'


export default class FavoriteItemCollection extends Collection {

    constructor(user, models) {
        super(user, models, 'favoriteItems', 'itemId')
    }

    add(item) {
        super.add({ userId: this.user.id, itemId: item })
    }

}
