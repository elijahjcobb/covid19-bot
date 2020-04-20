/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {KBCommand, KBMessage, KBResponse} from "@elijahjcobb/keybase-bot-builder";
import {Covid19, Country, Global, Report} from "@elijahjcobb/covid19";

function getMessageForCountry(country: Country): string {

	return `${country.country} has *${country.cases.toLocaleString()} total cases*. There were ${country.todayCases.toLocaleString()} new cases today and sadly ${country.todayDeaths.toLocaleString()} people lost their lives today. ${country.critical.toLocaleString()} people are in critical condition right now. There are *${country.active.toLocaleString()} active cases*, *${country.deaths.toLocaleString()} deaths*, and thankfully *${country.recovered.toLocaleString()} recoveries*. Out of one million people ${country.casesPerOneMillion.toLocaleString()} have the virus (\\~${((country.casesPerOneMillion / 1_000_000) * 100).toFixed(2)}%) and ${country.deathsPerOneMillion.toLocaleString()} and (\\~${((country.deathsPerOneMillion / country.casesPerOneMillion) * 100).toFixed(2)}%) of cases have died.`;

}

function getMessageForGlobal(global: Global): string {

	return `Throughout the world, the *total number of cases is ${global.cases.toLocaleString()}*. Sadly ${global.deaths.toLocaleString()} people have lost their life but thankfully ${global.recovered.toLocaleString()} have recovered.`;

}

export const commands: KBCommand[] = [
	{
		name: "global",
		description: "Get current global statistics.",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			const global: Global = await Covid19.getGlobal();
			await res.send(getMessageForGlobal(global));

		}
	},
	{
		name: "usa",
		description: "Get current statistics for the United States",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			const country: Country = await Covid19.getUnitedStates();
			await res.send(getMessageForCountry(country));

		}
	},
	{
		name: "country",
		description: "Get current statistics for any country.",
		usage: "!country China",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			const params: (string | number)[] = msg.getParameters();
			const param: string | number = params[0];
			if (typeof param === "number") return await res.send("*Whoops!* You must provide a country. Try `!country China`");

			const country: Country = await Covid19.getCountry(param);
			await res.send(getMessageForCountry(country));

		}
	},
	{
		name: "deaths",
		description: "The total amount of deaths world wide.",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			const global: Global = await Covid19.getGlobal();
			await res.send(global.deaths);

		}
	},
	{
		name: "cases",
		description: "The total amount of cases world wide.",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			const global: Global = await Covid19.getGlobal();
			await res.send(global.cases);

		}
	},
	{
		name: "recovered",
		description: "The total amount of recoveries world wide.",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			const global: Global = await Covid19.getGlobal();
			await res.send(global.recovered);

		}
	},
	{
		name: "rank",
		description: "The ranking of countries and cases. Provide a number to limit result count.",
		usage: "!rank 10",
		handler: async (msg: KBMessage, res: KBResponse): Promise<void> => {

			let rank: string | number = msg.getParameters()[0];
			if (typeof rank === "string") rank = 10000;

			const countries: Country[] = await Covid19.getAllCountries();

			countries.sort((a: Country, b: Country): number => {

				return b.cases - a.cases;

			});

			let message: string = "";
			let i: number = 1;

			for (const country of countries) {

				message += `*${i}*. ${country.country} _(${country.cases})_\n`;
				i++;

				if (i > rank) break;

			}

			await res.send(message);

		}
	},
];
