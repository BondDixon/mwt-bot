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
        .setName("balance")
        .setDescription("Check your balance")

        .addMentionableOption(option =>
            option.setName("user")
                .setDescription("The user to check the balance of")
        ),

    async execute(interaction) {

        const userID = interaction.options.getMentionable("user") || interaction.user;
        const username = userID.username;
        let profileData;

        try {
            profileData = await profileModel.findOne({userID: userID.id});
            if (!profileData) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("User not in database")
                    .setDescription("Please use the /start command to create a profile")
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                return interaction.reply({embeds: [embed]})
            }
        }
        catch (err) {
            console.log(err)
        }

        let currency = profileData.currency, bank = profileData.bank;

        // format
        currency = currency.toLocaleString();
        bank = bank.toLocaleString();


        console.log(username)

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setDescription(`**<@${userID.id}>'s balance** \n\n**BANK:** $${bank}\n**IN HAND:** $${currency}`)
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        await interaction.reply({embeds: [embed]})

    }
}