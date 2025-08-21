# Blog Website

A modern, open-source blogging platform built with **Astro**, **Supabase**, **Tiptap Editor**, and **OpenAI** assistance.

## ✨ Features

* 📝 **Rich Text Editing** with Tiptap (Notion-style editor)
* 📦 **Image & File Storage** powered by Supabase
* ⚡ **Blazing fast frontend** with Astro
* 🤖 **AI Assistance** for writing support using OpenAI
* 🔒 Authentication & user accounts (via Supabase Auth)
* 📊 SEO-friendly and optimized blog rendering

## 🛠️ Tech Stack

* **Frontend**: [Astro](https://astro.build/)
* **Editor**: [Tiptap](https://tiptap.dev/)
* **Database & Storage**: [Supabase](https://supabase.com/)
* **AI Assistance**: [OpenAI](https://openai.com/)
* **Deployment**: Vercel / Netlify / Your choice

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Santo-Philip/EchoPage.git
cd astro-supabase-blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
add new image in public folder and rename it as logo to change current logo everywhere

SUPABASE_URL=get_from-supabase
SUPABASE_ANON_KEY=get_from-supabase
NAME="EchoPage" change as you like 
EMAIL=example@demo.com # Add more email with a , seperated
PUBLIC_AI_API=get_from-openai
PUBLIC_AI_API_KEY=get_from-openai
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm run preview
```

## 📂 Project Structure

```
astro-supabase-blog/
├── public/          # Static assets
├── src/
│   ├── components/  # UI components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Astro pages
│   ├── lib/         # Utility functions
│   └── styles/      # Global styles
├── .env             # Environment variables
└── package.json
```

## 🌍 Deployment

You can deploy to **Vercel**, **Netlify**, or any static hosting provider. Make sure to set your environment variables in the hosting dashboard.

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a pull request

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

🚀 Built with passion using Astro, Supabase, Tiptap, and OpenAI.
