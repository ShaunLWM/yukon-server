import GamePlugin from '@plugin/GamePlugin'


export default class StampbookCover extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'update_stampbook': this.updateStampbook
        }
    }

    updateStampbook(args, user) {
        const { stampbookInfo, coverStamps } = args

        if (stampbookInfo && typeof stampbookInfo === 'object') {
            user.stampbookInfo = stampbookInfo
        }

        if (Array.isArray(coverStamps) && coverStamps.length <= 100) {
            user.coverStamps = coverStamps
        }

        user.update({
            stampbookInfo: user.stampbookInfo,
            coverStamps: user.coverStamps
        })
    }

}
