import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetterPrompt - AI 提示词优化工具",
  description: "专业的 AI 提示词优化工具，帮助你写出更好的 Prompt",
};

// Cyberpunk / Glitch Theme Configuration
const cyberpunkTheme = {
  token: {
    // Core Colors
    colorPrimary: "#00ff88",
    colorBgContainer: "#12121a",
    colorBgElevated: "#1c1c2e",
    colorBgLayout: "#0a0a0f",
    colorText: "#e0e0e0",
    colorTextSecondary: "rgba(224, 224, 224, 0.65)",
    colorTextTertiary: "rgba(224, 224, 224, 0.45)",
    colorBorder: "#2a2a3a",
    colorBorderSecondary: "#2a2a3a",
    // Typography
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    // Radius - sharp cuts for cyberpunk aesthetic
    borderRadius: 0,
    borderRadiusLG: 0,
    borderRadiusSM: 0,
    // Shadows
    boxShadow: "0 0 5px rgba(0, 255, 136, 0.1)",
    boxShadowSecondary: "0 0 10px rgba(0, 255, 136, 0.15)",
  },
  components: {
    Button: {
      colorPrimary: "#00ff88",
      colorPrimaryHover: "#00ff88",
      colorPrimaryActive: "#00cc6e",
      primaryColor: "#0a0a0f",
      borderRadius: 0,
      fontWeight: 600,
    },
    Input: {
      colorBgContainer: "#12121a",
      colorBorder: "#2a2a3a",
      colorPrimaryHover: "#00ff88",
      activeBorderColor: "#00ff88",
      hoverBorderColor: "#00ff88",
      activeShadow: "0 0 5px rgba(0, 255, 136, 0.25)",
      borderRadius: 0,
    },
    Select: {
      colorBgContainer: "#12121a",
      colorBgElevated: "#1c1c2e",
      colorBorder: "#2a2a3a",
      optionSelectedBg: "rgba(0, 255, 136, 0.1)",
      optionActiveBg: "rgba(0, 255, 136, 0.05)",
      borderRadius: 0,
    },
    Drawer: {
      colorBgElevated: "#12121a",
      colorBgMask: "rgba(0, 0, 0, 0.8)",
    },
    Modal: {
      colorBgElevated: "#12121a",
      colorBgMask: "rgba(0, 0, 0, 0.8)",
      borderRadiusLG: 0,
    },
    Card: {
      colorBgContainer: "#12121a",
      colorBorder: "#2a2a3a",
      borderRadius: 0,
    },
    Table: {
      colorBgContainer: "#12121a",
      headerBg: "#1c1c2e",
      rowHoverBg: "rgba(0, 255, 136, 0.05)",
      borderColor: "#2a2a3a",
    },
    Tabs: {
      inkBarColor: "#00ff88",
      itemActiveColor: "#00ff88",
      itemHoverColor: "#e0e0e0",
      itemSelectedColor: "#00ff88",
    },
    Tag: {
      defaultBg: "rgba(0, 255, 136, 0.1)",
      defaultColor: "#00ff88",
    },
    Badge: {
      colorBgContainer: "#00ff88",
      colorError: "#ff3366",
    },
    Message: {
      contentBg: "#1c1c2e",
    },
    Tooltip: {
      colorBgSpotlight: "#1c1c2e",
      colorTextLightSolid: "#e0e0e0",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body suppressHydrationWarning>
        <AntdRegistry>
          <ConfigProvider locale={zhCN} theme={cyberpunkTheme}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
