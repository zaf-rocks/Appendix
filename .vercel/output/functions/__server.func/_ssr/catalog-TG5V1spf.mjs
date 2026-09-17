//#region node_modules/.nitro/vite/services/ssr/assets/catalog-TG5V1spf.js
var GENRE_META = {
	games: {
		label: "Games",
		hint: "Play in the browser",
		tone: "coral"
	},
	social: {
		label: "Social",
		hint: "People and rooms",
		tone: "rose"
	},
	productivity: {
		label: "Productivity",
		hint: "Get it done",
		tone: "sky"
	},
	tools: {
		label: "Tools",
		hint: "One job, well",
		tone: "slate"
	},
	photo: {
		label: "Photo",
		hint: "Capture and edit",
		tone: "amber"
	},
	music: {
		label: "Music",
		hint: "Sound and karaoke",
		tone: "rose"
	},
	entertainment: {
		label: "Entertainment",
		hint: "Watch and wander",
		tone: "indigo"
	},
	education: {
		label: "Education",
		hint: "Learn something",
		tone: "teal"
	},
	health: {
		label: "Health",
		hint: "Body and mind",
		tone: "mint"
	},
	finance: {
		label: "Finance",
		hint: "Money without the circus",
		tone: "mint"
	},
	shopping: {
		label: "Shopping",
		hint: "Buy and sell",
		tone: "coral"
	},
	news: {
		label: "News",
		hint: "What happened",
		tone: "slate"
	},
	travel: {
		label: "Travel",
		hint: "Get there",
		tone: "sky"
	},
	maps: {
		label: "Maps",
		hint: "Where things are",
		tone: "teal"
	},
	food: {
		label: "Food",
		hint: "Eat well",
		tone: "amber"
	},
	weather: {
		label: "Weather",
		hint: "Look up",
		tone: "sky"
	},
	business: {
		label: "Business",
		hint: "Work tools",
		tone: "slate"
	},
	lifestyle: {
		label: "Lifestyle",
		hint: "Daily texture",
		tone: "indigo"
	},
	kids: {
		label: "Kids",
		hint: "Small humans",
		tone: "amber"
	},
	video: {
		label: "Video",
		hint: "Moving pictures",
		tone: "coral"
	},
	communication: {
		label: "Communication",
		hint: "Talk it out",
		tone: "sky"
	},
	personalization: {
		label: "Personalization",
		hint: "Make it yours",
		tone: "rose"
	},
	libraries: {
		label: "Libraries",
		hint: "Reference",
		tone: "teal"
	},
	"coming-soon": {
		label: "Coming soon",
		hint: "Not live yet",
		tone: "amber"
	}
};
var TONE_BG = {
	sky: "bg-cat-sky",
	mint: "bg-cat-mint",
	coral: "bg-cat-coral",
	rose: "bg-cat-rose",
	teal: "bg-cat-teal",
	amber: "bg-cat-amber",
	indigo: "bg-cat-indigo",
	slate: "bg-cat-slate"
};
function app(partial) {
	return {
		rating: 4.5,
		ratingsCount: 128,
		description: partial.tagline,
		...partial
	};
}
var SEED = [
	app({
		id: "photopea",
		name: "Photopea",
		tagline: "Serious photo editing that lives in a tab.",
		description: "Layers, PSD files, and a toolbar you already know — without a 4GB installer. A PWA that treats the browser like a studio.",
		url: "https://www.photopea.com/",
		developer: "Photopea",
		genres: [
			"photo",
			"tools",
			"productivity"
		],
		installable: true,
		featured: true,
		editorsPick: true,
		rating: 4.9,
		ratingsCount: 18420,
		source: "Public"
	}),
	app({
		id: "excalidraw",
		name: "Excalidraw",
		tagline: "Whiteboard with handwriting energy.",
		description: "Sketch diagrams that look human. Collaborate live. Install it and keep drawing on a plane.",
		url: "https://excalidraw.com/",
		developer: "Excalidraw",
		genres: ["productivity", "tools"],
		installable: true,
		featured: true,
		rating: 4.7,
		ratingsCount: 9320,
		source: "Public"
	}),
	app({
		id: "drawio",
		name: "draw.io",
		tagline: "Diagrams that survive airplane mode.",
		url: "https://app.diagrams.net/",
		developer: "JGraph",
		genres: [
			"productivity",
			"business",
			"tools"
		],
		offline: true,
		installable: true,
		rating: 4.8,
		ratingsCount: 22100,
		source: "Public"
	}),
	app({
		id: "squoosh",
		name: "Squoosh",
		tagline: "Shrink images on your device. Nobody else sees them.",
		url: "https://squoosh.app/",
		developer: "Google Chrome Labs",
		genres: ["photo", "tools"],
		offline: true,
		installable: true,
		editorsPick: true,
		rating: 4.8,
		ratingsCount: 5400,
		source: "Public"
	}),
	app({
		id: "svgomg",
		name: "SVGOMG",
		tagline: "SVG cleanup with a live preview.",
		url: "https://jakearchibald.github.io/svgomg/",
		developer: "Jake Archibald",
		genres: ["tools", "photo"],
		installable: true,
		rating: 4.5,
		ratingsCount: 2104,
		source: "Public"
	}),
	app({
		id: "pwa-directory",
		name: "PWA Directory",
		tagline: "Evidence-checked installable web apps.",
		url: "https://pwa.directory/",
		developer: "PWA Directory",
		genres: ["libraries", "tools"],
		offline: true,
		installable: true,
		rating: 4.6,
		ratingsCount: 880,
		source: "Public"
	}),
	app({
		id: "appbird",
		name: "appBird",
		tagline: "A roost for small AI-built web apps.",
		url: "https://appbird.store/",
		developer: "appBird",
		genres: ["libraries", "tools"],
		installable: true,
		aiBuilt: true,
		rating: 4.3,
		ratingsCount: 410,
		source: "Public"
	}),
	app({
		id: "karaokedokie",
		name: "KaraokeDokie",
		tagline: "Type a song. Get a performance pack.",
		description: "Visual-first karaoke kits for people who treat a living room like a venue. Coming soon — file your interest.",
		url: "#",
		developer: "ZAF Recordz",
		genres: [
			"music",
			"entertainment",
			"coming-soon"
		],
		aiBuilt: true,
		featured: true,
		comingSoon: true,
		editorsPick: true,
		rating: 4.8,
		ratingsCount: 96,
		source: "ZAF"
	}),
	app({
		id: "noteworthy",
		name: "Noteworthy",
		tagline: "A spatial notepad for thoughts that refuse a list.",
		url: "#",
		developer: "ZAF Labs",
		genres: [
			"productivity",
			"lifestyle",
			"coming-soon"
		],
		aiBuilt: true,
		featured: true,
		comingSoon: true,
		rating: 4.7,
		ratingsCount: 54,
		source: "ZAF"
	}),
	app({
		id: "preset-irl",
		name: "PRESET//IRL",
		tagline: "Save setups for gear that has no Save button.",
		url: "#",
		developer: "ZAF Labs",
		genres: [
			"music",
			"tools",
			"coming-soon"
		],
		featured: true,
		comingSoon: true,
		sponsored: true,
		rating: 4.6,
		ratingsCount: 33,
		source: "ZAF"
	}),
	app({
		id: "identity-studioz",
		name: "Identity StudioZ",
		tagline: "Stage names, glyphs, compatibility scores.",
		url: "#",
		developer: "ZAF Labs",
		genres: [
			"personalization",
			"tools",
			"coming-soon"
		],
		aiBuilt: true,
		comingSoon: true,
		rating: 4.5,
		ratingsCount: 21,
		source: "ZAF"
	}),
	app({
		id: "literalizer",
		name: "The Literalizer",
		tagline: "Jargon in. Human out. Landmines labeled.",
		url: "#",
		developer: "ZAF Labs",
		genres: [
			"productivity",
			"education",
			"coming-soon"
		],
		aiBuilt: true,
		comingSoon: true,
		rating: 4.4,
		ratingsCount: 18,
		source: "ZAF"
	}),
	app({
		id: "last-place",
		name: "Last Place",
		tagline: "Photo the spot so future-you can find it.",
		url: "#",
		developer: "Opportunity Co",
		genres: [
			"maps",
			"tools",
			"coming-soon"
		],
		comingSoon: true,
		rating: 4.3,
		ratingsCount: 12,
		source: "Dossier"
	}),
	app({
		id: "did-i-lock",
		name: "Did I Lock It?",
		tagline: "One tap. Timestamp. Close the loop.",
		url: "#",
		developer: "Opportunity Co",
		genres: [
			"lifestyle",
			"tools",
			"coming-soon"
		],
		comingSoon: true,
		rating: 4.5,
		ratingsCount: 40,
		source: "Dossier"
	}),
	app({
		id: "appendix-self",
		name: "APPendix",
		tagline: "This store. The extra organ the web grew anyway.",
		description: "A catalog of progressive web apps. No APK, no 30% haircut, no ‘download now’ trap. You open a link. If it is good, you keep it.",
		url: "/",
		developer: "APPendix",
		genres: ["libraries", "tools"],
		installable: true,
		aiBuilt: true,
		featured: true,
		editorsPick: true,
		rating: 5,
		ratingsCount: 1,
		source: "This build"
	})
];
var GENRES = Object.keys(GENRE_META);
function isLive(app) {
	return Boolean(app.url && app.url !== "#" && !app.comingSoon);
}
//#endregion
export { isLive as a, TONE_BG as i, GENRE_META as n, SEED as r, GENRES as t };
