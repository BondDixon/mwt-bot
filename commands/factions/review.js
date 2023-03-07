const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("review")
        .setDescription("Create an anonymous review for a faction")
        .addStringOption(option =>
            option.setName("faction")
                .setDescription("The faction to review")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("rating")
                .setDescription("The rating of the faction")
                .setRequired(true)
                .addChoices(
                    { name: "1", value: 1 },
                    { name: "2", value: 2 },
                    { name: "3", value: 3 },
                    { name: "4", value: 4 },
                    { name: "5", value: 5 }
                )
        )
        .addStringOption(option =>
            option.setName("title")
                .setDescription("The title of the review")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("body")
                .setDescription("The body of the review")
                .setRequired(true)
        ),

    async execute(interaction) {

        const
            faction = interaction.options.getString("faction"),
            rating = interaction.options.getInteger("rating"),
            title = interaction.options.getString("title"),
            body = interaction.options.getString("body");

        if (title.length > 32) return interaction.reply({
            content: "Your review title must be less than 32 characters",
            ephemeral: true
        });
        if (body.length > 1024) return interaction.reply({
            content: "Your review body must be less than 1024 characters",
            ephemeral: true
        });

        const
            factionModel = require("../../models/factionSchema.js"),
            reviewModel = require("../../models/reviewSchema.js"),
            review = await reviewModel.findOne({ faction: faction, author: interaction.user.id });

        const
            newReview = new reviewModel({
                faction: faction,
                title: title,
                body: body,
                rating: rating
            });

        await newReview.save().catch(err => console.log(err));

        // Check if the faction exists
        if (!await factionModel.exists({ factionName: faction })) {
            return interaction.reply({
                content: "That faction does not exist. Request a faction in <#1080574694815694971>",
                ephemeral: true
            });
        }

        // Get faction form DB
        let factionDB = await factionModel.findOne({ factionName: faction });


        // Add review to faction
        factionDB.factionReviews.push(newReview._id);
        await factionDB.save().catch(err => console.log(err));

        // Calculate new rating
        let newRating = 0;

        for (let i = 0; i < factionDB.factionReviews.length; i++) {
            let review = await reviewModel.findById(factionDB.factionReviews[i]);

            console.log(review)

            newRating += review.rating;
        }

        newRating /= factionDB.factionReviews.length;

        // Update faction rating
        factionDB.rating = newRating;
        await factionDB.save().catch(err => console.log(err));

        // Send review embed
        const embed = new EmbedBuilder()
            .setTitle("Review")
            .setDescription(`Your review for ${faction} has been submitted`)
            .addFields(
                { name: "Rating", value: rating, inline: true },
                { name: "Title", value: title, inline: true },
                { name: "Body", value: body, inline: true },
                { name: "Avg. Faction Rating", value: newRating, inline: true }
            )
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        interaction.reply({ embeds: [embed] });


    }
};
