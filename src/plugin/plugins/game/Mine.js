import GamePlugin from '@plugin/GamePlugin'


export default class Mine extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'mine': this.mine
        }

        this.mineRooms = [813, 805]
        this.miners = new Map()
        this.coinReward = 10
        this.intervalMs = 10000
    }

    mine(args, user) {
        if (!user.room || !this.mineRooms.includes(user.room.id)) return

        if (this.miners.has(user.id)) return

        this.reward(user)

        let interval = setInterval(() => {
            if (!user.room || !this.mineRooms.includes(user.room.id)) {
                this.stopMining(user.id)
                return
            }
            this.reward(user)
        }, this.intervalMs)

        this.miners.set(user.id, interval)
    }

    async reward(user) {
        user.coins += this.coinReward
        await user.update({ coins: user.coins })
        user.send('mine_coins', { coins: this.coinReward })
    }

    stopMining(userId) {
        let interval = this.miners.get(userId)
        if (interval) {
            clearInterval(interval)
            this.miners.delete(userId)
        }
    }

}
