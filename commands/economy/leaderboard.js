const {
        SlashCommandBuilder,
        EmbedBuilder
    } = require("discord.js"),
    database = require("mongoose"),
    work_options = [
        ["You wrote a book", 1000, 5000],
        ["You painted a portrait", 500, 2000],
        ["You repaired a car engine", 500, 3000],
        ["You wrote a software program", 2000, 10000],
        ["You designed a logo", 200, 1000],
        ["You installed a solar panel system", 2000, 10000],
        ["You repaired a leaking roof", 500, 3000],
        ["You filmed a commercial", 1000, 5000],
        ["You created a social media campaign", 500, 2000],
        ["You baked a wedding cake", 500, 3000],
        ["You wrote a screenplay", 1000, 5000],
        ["You built a website", 1000, 5000],
        ["You designed a garden", 500, 2000],
        ["You repaired a broken fence", 200, 1000],
        ["You cooked a gourmet meal", 500, 3000],
        ["You wrote a research paper", 1000, 5000],
        ["You cleaned a house", 200, 1000],
        ["You created a marketing plan", 500, 2000],
        ["You repaired a malfunctioning computer", 500, 3000],
        ["You designed a custom piece of furniture", 1000, 5000],
        ["You taught a yoga class", 200, 1000],
        ["You organized a charity event", 1000, 5000],
        ["You painted a room", 200, 1000],
        ["You planned a wedding", 1000, 5000],
        ["You built a treehouse", 500, 3000],
        ["You wrote a grant proposal", 1000, 5000],
        ["You designed a kitchen", 2000, 10000],
        ["You repaired a broken refrigerator", 500, 3000],
        ["You made a sculpture", 500, 2000],
        ["You wrote a business plan", 1000, 5000],
        ["You created a mobile app", 2000, 10000],
        ["You repaired a leaky faucet", 200, 1000],
        ["You filmed a short movie", 1000, 5000],
        ["You designed a wedding dress", 2000, 10000],
        ["You painted a landscape", 500, 2000],
        ["You taught a cooking class", 200, 1000],
        ["You organized a music festival", 1000, 5000],
        ["You repaired a broken dishwasher", 500, 3000],
        ["You designed a home theater", 2000, 10000],
        ["You wrote a scientific paper", 1000, 5000],
        ["You built a bicycle", 500, 3000],
        ["You created a new product", 1000, 5000],
        ["You designed a book cover", 200, 1000],
        ["You repaired a broken television", 500, 3000],
        ["You wrote a poem", 200, 1000],
        ["You filmed a music video", 1000, 5000],
        ["You designed a brochure", 200, 1000],
        ["You cooked a gourmet meal for a party", 1000, 5000],
        ["You repaired a broken washing machine", 500, 3000],
        ["You sorted mail", 50, 200],
        ["You folded clothes", 50, 200],
        ["You swept the floors", 50, 200],
        ["You stocked shelves", 50, 200],
        ["You assembled boxes", 50, 200],
        ["You answered phones", 50, 200],
        ["You cleaned windows", 50, 200],
        ["You packed orders", 50, 200],
        ["You operated a cash register", 50, 200],
        ["You watered plants", 50, 200],
        ["You dressed up as a mascot", 100, 500],
        ["You searched for lost pets", 200, 1000],
        ["You wrote someone's dating profile", 50, 200],
        ["You delivered singing telegrams", 100, 500],
        ["You rented out your swimming pool", 50, 200],
        ["You sold handmade jewelry on the street", 100, 500],
        ["You provided pet therapy services", 50, 200],
        ["You cleaned up crime scenes", 200, 1000],
        ["You decorated Christmas trees", 100, 500],
        ["You walked dogs in fancy attire", 50, 200]
    ];
const profileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View the leaderboard of the server")

        .addStringOption(
            option => option.setName("type")
                .setDescription("The type of leaderboard you want to view")
                .setRequired(true)
                .addChoices(
                    {name: "cash", value: "cash"},
                    {name: "bank", value: "bank"}
                )
        ),


    async execute(interaction) {

        const sortOption = interaction.options.getString("type");
        let results, leaderboard;
        let i = 0;

        if (sortOption === "cash") {
            results = await profileModel.find({}).sort({ currency: -1 }).exec();
            leaderboard = results.map(result => {
                i++; return `${i}. ${interaction.client.users.cache.get(result.userID)} - $${result.currency}`;
            }).join("\n");

        }

        if (sortOption === "bank") {

            results = await profileModel.find({}).sort({ bank: -1 }).exec();
            leaderboard = results.map(result => {
                i++; return `${i}. ${interaction.client.users.cache.get(result.userID)} - $${result.bank}`;
            }).join("\n");


        }


        const embed = new EmbedBuilder()
            .setTitle("Leaderboard" + ` (By ${sortOption})`)
            .setDescription(leaderboard)
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        await interaction.reply({embeds: [embed]});

    }

}