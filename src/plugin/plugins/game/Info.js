import GamePlugin from '@plugin/GamePlugin'


export default class Info extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'toggle_streamer': this.toggleStreamer
        }
    }

    toggleStreamer(args, user) {
        if (user.rank < 2) return

        user.streamer = !user.streamer
        user.send('toggle_streamer', { streamer: user.streamer })
    }

}
