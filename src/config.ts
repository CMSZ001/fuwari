import type {
	CommentConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "CMSZ Blog",
	subtitle: "写点代码，也写点生活。",
	lang: "zh_CN",
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "我的",
			url: "",
			children: [LinkPreset.Notes, LinkPreset.About],
		},
		{
			name: "统计",
			url: "https://umami.acmsz.top/share/CFirWMQoiIUmgPLm/www.acmsz.top", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
		{
			name: "状态",
			url: "https://status.acmsz.top/", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2706210065&spec=0", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "CMSZ",
	bio: "世界美好与莫环环相扣。",
	links: [
		{
			name: "Email",
			icon: "fa6-solid:envelope", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "mailto:me@acmsz.top",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/CMSZ001",
		},
		{
			name: "RSS",
			icon: "fa6-solid:square-rss",
			url: "/rss.xml",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const umamiConfig: UmamiConfig = {
	enable: true,
	baseUrl: "https://umami.acmsz.top",
	shareId: "CFirWMQoiIUmgPLm",
	timezone: "Asia/Shanghai",
};

export const commentConfig: CommentConfig = {
	enable: true,
	type: "waline",
	waline: {
		serverURL: "https://waline.acmsz.top", // 替换为你的 Waline 服务端地址
		lang: "zh-CN",
		pageSize: 10,
		wordLimit: 0,
		count: 5,
		pageview: true,
		reaction: true,
		requiredMeta: ["nick", "mail"],
		whiteList: [],
	},
};
