import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	productionBrowserSourceMaps: false,
	typescript: {
		// !! WARN !!
		// This allows production builds to successfully complete
		// even if your project has type errors.
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true, // ignore ESLint errors
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "20mb", // adjust depending on your image sizes
		},
	},
};

export default nextConfig;
