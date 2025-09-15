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
};

export default nextConfig;
