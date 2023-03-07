const {
        SlashCommandBuilder, EmbedBuilder
    } = require("discord.js"),
    database = require("mongoose");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("new-faction")
        .setDescription("Create a new faction")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of your faction")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("description")
                .setDescription("The description of your faction")
                .setRequired(true))
        .addStringOption(
            option => option.setName("invite")
                .setDescription("The invite link to your faction's Discord server")
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName("logo")
                .setDescription("The logo of your faction")
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName("banner")
                .setDescription("The banner of your faction")
                .setRequired(false)),

    async execute(interaction) {

        const
            name = interaction.options.getString("name"),
            description = interaction.options.getString("description"),
            logo = interaction.options.getAttachment("logo"),
            banner = interaction.options.getAttachment("banner") || null,
            invite = interaction.options.getString("invite") || null;

        if (name.length > 32) return interaction.reply({
            content: "Your faction name must be less than 32 characters",
            ephemeral: true
        });
        if (description.length > 1024) return interaction.reply({
            content: "Your faction description must be less than 1024 characters",
            ephemeral: true
        });
        if (invite && invite.length > 256) return interaction.reply({
            content: "Your faction invite link must be less than 256 characters",
            ephemeral: true
        });
        if (logo.size > 8388608) return interaction.reply({
            content: "Your faction logo must be less than 8MB",
            ephemeral: true
        });

        const
            factionModel = require("../../models/factionSchema.js");


        // check if faction name is taken

        if (await factionModel.exists({factionName: name})) return interaction.reply({
            content: "That faction name is already taken",
            ephemeral: true
        });

        // save faction to database

        const
            factionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            factionOwner = interaction.user.id,
            factionMembers = [factionOwner],
            factionReviews = [],
            factionAvgRating = 0;

        //    factionName: {type: String, required: true, unique: true},
        //     factionID: {type: String, required: true, unique: true},
        //     factionOwner: {type: String, required: true},
        //     factionMembers: {type: Array, required: true},
        //     factionReviews: {type: Array, required: true},
        //     factionDescription: {type: String, required: true},
        //     factionLogo: {type: String, required: true},
        //     factionBanner: {type: String, required: true},
        //     factionInvite: {type: String, required: true},
        //     factionAvgRating: {type: Number, required: true}

        await factionModel.create({
            factionName: name,
            factionID: factionID,
            factionOwner: factionOwner,
            factionMembers: factionMembers,
            factionReviews: factionReviews,
            factionDescription: description,
            factionLogo: logo.url,
            factionBanner: banner.url,
            factionInvite: invite,
            factionAvgRating: factionAvgRating
        });

        const embed = new EmbedBuilder()
            .setTitle("New Faction")
            .setDescription(`Your faction, ${name}, has been created!`)
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        interaction.reply({embeds: [embed]});


    }
}


