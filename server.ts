import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// Mock database for user profile
let mockUser = {
  name: "John Doe",
  email: "herocalze11@gmail.com",
  bio: "Full-stack developer and framework enthusiast.",
  location: "San Francisco, CA",
  website: "https://launchfast.dev"
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get User Profile
  app.get("/api/user", (req, res) => {
    res.json(mockUser);
  });

  // API Route: Update User Profile
  app.post("/api/user/update", (req, res) => {
    const { name, bio, location, website } = req.body;
    mockUser = { ...mockUser, name, bio, location, website };
    res.json({ message: "Profile updated successfully", user: mockUser });
  });

  // API Route: Fetch GitHub Profile (Securely using GITHUB_TOKEN)
  app.get("/api/github/profile", async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return res.status(500).json({ error: "GITHUB_TOKEN not configured in Secrets." });
    }

    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/vnd.github+json",
          "User-Agent": "LaunchFast-App"
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}`);
      }

      const data = await response.json();
      res.json({
        name: data.name,
        login: data.login,
        avatar_url: data.avatar_url,
        public_repos: data.public_repos,
        followers: data.followers,
        bio: data.bio
      });
    } catch (error) {
      console.error("GitHub Fetch Error:", error);
      res.status(500).json({ error: "Failed to fetch GitHub profile." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
