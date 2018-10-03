const { Orders } = require('../../sequelize')

const { status } = require('../../helpers')

const { canCook } = require('../../permissions')

module.exports = {
  name: 'ostatus',
  permissions: canCook,
  description: 'Lists info about a specific order.',
  async execute (message, args, client) {
    const order = await Orders.findOne({ where: { id: args.shift() } })
    if (!order) message.reply('Couldn\'t find that order.')
    else {
      message.channel.send(`
        id: ${order.get('id')}
        user: ${order.get('user')}
        description: ${order.get('description')}
        channel: ${order.get('channel')}
        status: ${status(order.get('status'))}
        claimer: ${order.get('claimer')}
        url: ${order.get('url')}
        ticketMessageID: ${order.get('ticketMessageID')}`, { code: true }
      )
    }
  }
}
