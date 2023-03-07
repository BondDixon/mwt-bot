const {
        SlashCommandBuilder, EmbedBuilder
    } = require("discord.js"),
    database = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("view-faction")
        .setDescription("View a faction")
        .addStringOption(option =>
            option.setName("faction")
                .setDescription("The faction to view")
                .setRequired(true)),
    async execute(interaction) {

        const
            factionModel = require("../../models/factionSchema.js"),
            faction = await factionModel.findOne({factionName: interaction.options.getString("faction")});

        if (!faction) return interaction.reply({content: "That faction doesn't exist!", ephemeral: true});

        const embed = new EmbedBuilder()
            .setTitle(faction.factionName)
            .setDescription(`**DESCRIPTION** ${faction.factionDescription}\n\n[Join ${faction.factionMembers.length} others!](${faction.factionInvite})`
                + `\n\n**Members:**\n${faction.factionMembers.map(member => `<@${member}>`).join(", ")}`)
            .setTimestamp()
            .setImage(faction.factionBanner)
            .setThumbnail(faction.factionLogo)
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        interaction.reply({embeds: [embed]});

    }
}