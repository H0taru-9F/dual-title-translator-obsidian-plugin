# Dual Title Translator for Obsidian

Automatically translates note titles into a second language using DeepL while keeping the original title intact.

Perfect for bilingual vaults, language learning, or notes that need both a native and translated title.

---

## ✨ Features

- 🌍 Translate note titles using **DeepL**
- 📝 Keep **original title + translated title**
- 🔁 Auto-rename on file rename
- 🚫 Exclude specific folders from translation
- 📁 Folder-based blacklist with subfolder control
- 🧠 Language auto-detection support
- ⚡ Works fully inside Obsidian

---

## ⚙️ Settings

### 🚀 First-time setup

When you enable the plugin for the first time, a few simple steps are required.

---

### 🔑 DeepL API Key

To use the plugin, you need a **DeepL API key**.

1. Go to the official DeepL developer website:  
   👉 https://www.deepl.com/pro-api

2. Create a free DeepL API account
	- The **Free plan** allows up to **500,000 characters per month**
	- A payment card is required during registration (DeepL requirement)
	- You will **not be charged** unless you upgrade the plan

3. Copy your API key

4. Paste the key into the **DeepL API Key** field in plugin settings  
   ⚠️ Make sure there are **no spaces** before or after the key

---

### 🔗 Title separator

Choose a separator that will be placed between the original and translated title.

Examples: ⇋ | — | :: | /


You can use **any characters or symbols** you like.

---

### 🌐 Languages

Select two languages:
- **First language**
  - Can be set manually
  - Or use **AUTO** (DeepL auto-detect)
- **Second language**
	- defaults to English

These languages work **bidirectionally**.

This means:
- If the note title is written in the first language, it will be translated into the second
- If the note title is written in the second language, it will be translated into the first

⚠️ This feature relies on language detection and may not always be perfectly accurate.

---

### 🕘 Separator history

The plugin keeps a history of separators you have used before.

This allows you to quickly switch between previously used separators without retyping them.

---

### 🚫 Excluded folders

You can specify folders whose notes **should not be translated**.

- Any note inside a listed folder will be ignored
- Subfolders can still be translated if they are not explicitly excluded

This gives you fine-grained control over where automatic translation is applied.

---

## 🧠 How it works

1. You rename a note
2. Plugin detects the rename event
3. Checks if the file is allowed to be translated
4. Sends title to DeepL
5. Renames the note with translated title

---

## 🛡 Permissions & Privacy

- Only note titles are sent to DeepL
- No content is stored or logged
- No data is shared with third parties except DeepL

---

## 🧩 Compatibility

- Obsidian `v1.5+`
- Desktop only (for now)
- Requires internet connection for translation

---

## 🐞 Known limitations

- DeepL API rate limits apply
- Translation may fail if API key is invalid or blocked
- AUTO language detection depends on DeepL accuracy

---

## 📄 License

ISC License  
© 2025 H0taru-9F

---

## ❤️ Contributing

Pull requests and ideas are welcome!

If you find a bug or want a feature, feel free to open an issue.

---

## ⭐ Support

If you like the plugin, consider starring the repository 💙  
It really helps visibility in the Obsidian ecosystem.




