import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sequelize", "mysql2"],
};

export default nextConfig;
