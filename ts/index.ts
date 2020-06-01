/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import * as FS from "fs";
import * as Path from "path";
import {KBBot, KBConversation, KBResponse} from "@elijahjcobb/keybase-bot-builder";
import {commands} from "./commands";

(async(): Promise<void> => {

	const path: string = Path.resolve("./paperkey.txt");
	const fileData: Buffer = FS.readFileSync(path);
	const paperKey: string = fileData.toString("utf8");

	const bot: KBBot = await KBBot.init("covid19_stats", paperKey, {
		debugging: false,
		logging: true
	});

	for (const command of commands) bot.command(command);

	bot.onNewConversation(async(conv: KBConversation, res: KBResponse): Promise<void> => {

		await res.send(`Hello! If you notice any problems with me let @elijahcobb know. My data is from the John Hopkins CSSE and is made available by covid19api.com and accessible from the NPM package \`@elijahjcobb/covid19\`. Use a \`!\` to see my commands.`);

	});

	bot.start();

})().catch((err: any): void => console.error(err));