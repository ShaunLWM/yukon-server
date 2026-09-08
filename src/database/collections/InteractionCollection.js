import Collection from '../Collection'


export default class InteractionCollection extends Collection {

    constructor(user, models) {
        super(user, models, 'interactions', 'interaction')
    }

    add(interaction) {
        super.add({ userId: this.user.id, interaction: interaction })
    }

    toJSON() {
        return this.keys
    }

}
