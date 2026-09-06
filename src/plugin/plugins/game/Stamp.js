import GamePlugin from '@plugin/GamePlugin'

import { isNumber } from '@utils/validation'


export default class Stamp extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'collect_stamp': this.collectStamp
        }

        this.stamps = this.crumbs.stamps
    }

    collectStamp(args, user) {
        if (!isNumber(args.stamp)) return

        if (!this.stamps[args.stamp]) return

        if (user.stamps.includes(args.stamp)) return

        user.stamps.add(args.stamp)
        user.send('stamp_earned', { stamp: args.stamp })
    }

}
