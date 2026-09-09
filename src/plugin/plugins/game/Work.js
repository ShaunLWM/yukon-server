import GamePlugin from '@plugin/GamePlugin'


export default class Work extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'start_work': this.startWork,
            'work_picked': this.workPicked,
            'work_fulfilled': this.workFulfilled
        }

        this.workers = new Map()

        this.coinReward = 20
        this.initialDelay = 3000
        this.cooldownMs = 5000

        this.jobRooms = {
            330: {
                tables: [
                    { x: 493, y: 712 },
                    { x: 763, y: 828 },
                    { x: 1063, y: 795 }
                ]
            },
            110: {
                tables: [
                    { x: 418, y: 499 },
                    { x: 599, y: 744 },
                    { x: 457, y: 712 }
                ]
            }
        }
    }

    startWork(args, user) {
        if (!user.room || !(user.room.id in this.jobRooms)) return
        if (this.workers.has(user.id)) return

        this.workers.set(user.id, { roomId: user.room.id, busy: false })

        setTimeout(() => this.sendWorkRequest(user), this.initialDelay)
    }

    sendWorkRequest(user) {
        let worker = this.workers.get(user.id)
        if (!worker) return
        if (!user.room || user.room.id !== worker.roomId) {
            this.stopWork(user.id)
            return
        }

        let config = this.jobRooms[user.room.id]
        let table = config.tables[Math.floor(Math.random() * config.tables.length)]

        worker.busy = true
        user.send('work_request', { x: table.x, y: table.y })
    }

    workPicked(args, user) {
        let worker = this.workers.get(user.id)
        if (!worker || !worker.busy) return
        if (!user.room) return

        user.room.send(user, 'work_picked', {
            workerId: user.id,
            frame: args.frame
        })
    }

    async workFulfilled(args, user) {
        let worker = this.workers.get(user.id)
        if (!worker || !worker.busy) return
        if (!user.room) return

        worker.busy = false

        user.room.send(user, 'work_delivered', {
            workerId: user.id,
            deliveryX: args.deliveryX,
            deliveryY: args.deliveryY,
            frame: args.frame
        })

        user.coins += this.coinReward
        await user.update({ coins: user.coins })
        user.send('job_coins', { coins: this.coinReward })

        setTimeout(() => this.sendWorkRequest(user), this.cooldownMs)
    }

    stopWork(userId) {
        this.workers.delete(userId)
    }

}
