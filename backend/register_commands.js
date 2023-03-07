require('dotenv').config();

const
    {REST, Routes} = require('discord.js'),
    fs = require('node:fs'),
    token = process.env.TOKEN,
    clientId = "1078084068220092496";

console.log(token)

const commands = []

// FOr each directory in the commands folder
fs.readdirSync('../commands').forEach(dir => {

    // Loop through each file in the directory
    fs.readdirSync(`../commands/${dir}`).forEach(file => {

        if (!file.endsWith('.js')) return;
		file = require(`../commands/${dir}/${file}`)
		commands.push(file.data.toJSON())

		console.log(`Loaded command ${file.data.name} from ${dir}`)

    });
});

console.log("=====================================")

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// Fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();