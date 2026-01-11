export const config: VercelConfig = {
  rewrites: [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/frontend/$1"
    }
  ],
  buildCommand: "cd frontend && bun run build",
  outputDirectory: "frontend/dist",
  cleanUrls: true,
  trailingSlash: false,
};
