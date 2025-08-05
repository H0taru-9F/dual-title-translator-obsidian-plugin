import {request} from "obsidian";

export default async function deeplTranslate(text: string, targetLang: string, apiKey: string) {
	const body = new URLSearchParams();
	body.append('auth_key', apiKey);
	body.append('text', text);
	body.append('target_lang', targetLang);

	try {
		const response = await request({
			url: 'https://api-free.deepl.com/v2/translate',
			method: 'POST',
			contentType: 'application/x-www-form-urlencoded',
			body: body.toString(),
		});

		const json = JSON.parse(response);
		return json.translations[0].text;
	} catch (error) {
		console.error('Error during translation:', error);
		throw error; // Re-throw the error for further handling
	}

}
