const DDEmbed = require("../../structures/DDEmbed.struct");

const { Blacklist, Orders, Op } = require("../../sequelize");

const { generateID } = require("../../helpers");

const { everyone } = require("../../permissions");

module.exports = {
	name: "order",
	permissions: everyone,
	description: "Order your donuts here.",
	async execute(message, args, client) {
		if (!args) return;
		if (await Blacklist.findOne({ where: { [Op.or]: [{ id: message.author.id }, { id: message.guild.id }] } })) {
			return message.reply("Either you or your guild have been blacklisted.");
		}

		const generatedID = generateID(6); // Note that this is actually a 7 char id
		console.log(generatedID);

		try {
			await Orders.create({
				id: generatedID,
				user: message.author.id,
				description: args.join(" "),
				channel: message.channel.id,
				status: 0,
				claimer: null,
				url: null,
				ticketMessageID: null
			});
		} catch (e) {
			message.reply(e);
		}

		const embed =
			new DDEmbed(client)
				.setStyle("white")
				.setTitle("Ticket Created")
				.setDescription(`:ticket: Ticket Placed! Your ticketID: \`${generatedID}\``);

		message.channel.send(embed);
	},
};
