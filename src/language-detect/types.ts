export type LangCode =
	| 'AR' | 'BG' | 'CS' | 'DA' | 'DE' | 'EL' | 'EN' | 'ES' | 'ET'
	| 'FI' | 'FR' | 'HE' | 'HU' | 'ID' | 'IT' | 'JA' | 'KO' | 'LT'
	| 'LV' | 'NB' | 'NL' | 'PL' | 'PT' | 'RO' | 'SK'
	| 'SL' | 'SV' | 'TH' | 'TR' | 'UK' | 'VI' | 'ZH';

export type Script = 'latin' | 'cyrillic' | 'other';

export type LanguageMeta = {
	code: LangCode;
	name: string;
	script: Script;
};

