import GamePlugin from '@plugin/GamePlugin'

import { hasProps, isNumber, isInRange, isString, isLength } from '@utils/validation'


export default class OutfitLoader extends GamePlugin {

    constructor(handler) {
        super(handler)

        this.events = {
            'save_outfit': this.saveOutfit,
            'delete_slot': this.deleteSlot,
            'get_all_slots': this.getAllSlots,
            'load_slot': this.loadSlot,
            'rename_outfit': this.renameOutfit
        }

        this.items = this.crumbs.items
    }

    async loadSlot(args, user) {
        if (!hasProps(args, 'slot') || !isNumber(args.slot) || !isInRange(args.slot, 1, 12)) {
            return
        }

        let outfit = await this.db.outfits.findOne({
            where: { userId: user.id, slot: args.slot },
            raw: true
        })

        if (!outfit) {
            return
        }

        let slots = ['head', 'face', 'neck', 'body', 'hand', 'feet', 'photo', 'color', 'flag']

        for (let slot of slots) {
            let itemId = parseInt(outfit[slot])
            if (slot === 'color') {
                user.setItem(slot, itemId)
                continue
            }
            if (itemId === 0) {
                user.setItem(slot, 0)
            } else if (this.items[itemId] && user.inventory.includes(itemId)) {
                user.setItem(slot, itemId)
            }
        }
    }

    async getAllSlots(args, user) {
        let outfits = await this.db.outfits.findAll({
            where: { userId: user.id },
            raw: true
        })

        user.send('slot', { outfits: outfits })
    }

    async saveOutfit(args, user) {
        if (!hasProps(args, 'slot') || !isNumber(args.slot) || !isInRange(args.slot, 1, 12)) {
            return
        }

        let items = {}
        let slots = ['head', 'face', 'neck', 'body', 'hand', 'feet', 'photo', 'color', 'flag']

        for (let slot of slots) {
            items[slot] = user[slot] || 0
        }

        let name = (args.name && isString(args.name)) ? args.name.substring(0, 30) : null

        await this.db.outfits.destroy({ where: { userId: user.id, slot: args.slot } })
        await this.db.outfits.create({ userId: user.id, slot: args.slot, name: name, ...items })

        await this.getAllSlots(args, user)
    }

    async deleteSlot(args, user) {
        if (!hasProps(args, 'slot') || !isNumber(args.slot) || !isInRange(args.slot, 1, 12)) {
            return
        }

        await this.db.outfits.destroy({ where: { userId: user.id, slot: args.slot } })

        await this.getAllSlots(args, user)
    }

    async renameOutfit(args, user) {
        if (!hasProps(args, 'slot') || !isNumber(args.slot) || !isInRange(args.slot, 1, 12)) {
            return
        }

        let name = (args.name && isString(args.name)) ? args.name.substring(0, 30) : null

        await this.db.outfits.update(
            { name: name },
            { where: { userId: user.id, slot: args.slot } }
        )

        await this.getAllSlots(args, user)
    }

}
