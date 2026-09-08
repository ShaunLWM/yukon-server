import GamePlugin from '@plugin/GamePlugin'

import { hasProps, isString } from '@utils/validation'


export default class Info extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'toggle_streamer': this.toggleStreamer,
            'set_interaction': this.setInteraction
        }
    }

    toggleStreamer(args, user) {
        if (user.rank < 2) return

        user.streamer = !user.streamer
        user.send('toggle_streamer', { streamer: user.streamer })
    }

    setInteraction(args, user) {
        if (!hasProps(args, 'interaction')) return
        if (!isString(args.interaction)) return
        if (args.interaction.length > 100) return

        if (!user.interactions.includes(args.interaction)) {
            user.interactions.add(args.interaction)
        }
    }

}
