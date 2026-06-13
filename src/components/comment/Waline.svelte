<script lang="ts">
import "@waline/client/waline.css";
import "@waline/client/waline-meta.css";
import type { WalineInstance } from "@waline/client";
import { init } from "@waline/client";
import { onMount } from "svelte";
import { commentConfig } from "@/config";

let { path }: { path: string } = $props();

let walineInstance: WalineInstance | null = null;

function initWaline() {
	if (walineInstance) {
		walineInstance.destroy();
		walineInstance = null;
	}

	const el = document.getElementById("waline");
	if (!el) return;

	walineInstance = init({
		el,
		...(commentConfig.waline as Record<string, unknown>),
		path,
		dark: "html.dark",
	} as Parameters<typeof init>[0]);
}

function onSwupContentReplaced() {
	initWaline();
}

onMount(() => {
	initWaline();

	// Re-initialize on SWUP navigation
	document.addEventListener("swup:contentReplaced", onSwupContentReplaced);

	return () => {
		document.removeEventListener("swup:contentReplaced", onSwupContentReplaced);
		if (walineInstance) {
			walineInstance.destroy();
			walineInstance = null;
		}
	};
});
</script>

<div class="waline-wrapper">
  <div id="waline"></div>
</div>

<style>
  /* --- Waline 美化样式 --- */
  :global(:root) {
    /* 1. 颜色适配：让按钮和高亮色跟随主题 */
    --waline-theme-color: var(--primary);
    --waline-active-color: var(--primary);

    /* 2. 字体与背景适配 */
    --waline-font-size: 1rem;
    --waline-bg-color-light: var(--card-bg);

    /* 3. 边框与圆角：跟随 Fuwari 的圆润风格 */
    --waline-border-color: var(--line-divider);
    --waline-avatar-radius: 50%;
    --waline-box-shadow: none; /* 去掉默认阴影，以免双重阴影 */
  }
  /* 暗黑模式适配微调 */
  :global(html.dark) {
    --waline-border-color: rgba(255, 255, 255, 0.1);
    --waline-bgcolor: #1e1e1e;
    --waline-bgcolor-light: #2a2a2a;

    /* 修复暗色模式下 Reaction 组件文字颜色不可见的问题 */
    --waline-color: rgba(255, 255, 255, 0.9);
  }

  /* 针对 Reaction 组件及评论计数的强制覆盖 */
  :global(html.dark .wl-reaction-title),
  :global(html.dark .wl-reaction-text),
  :global(html.dark .wl-count) {
    color: rgba(255, 255, 255, 0.9);
  }

  /* --- 细节修饰 --- */

  /* 输入框美化 */
  :global(.wl-editor) {
    transition: all 0.3s ease;
    border-radius: 1rem !important;
    padding: 1rem !important;
  }
  /* 按钮美化 */
  :global(.wl-btn.primary) {
    border-radius: 0.75rem !important;
    border: none !important;
    background: var(--primary) !important;
    color: white !important;
    box-shadow: 0 4px 10px -2px var(--primary-20) !important;
  }
  /* 去掉多余的版权信息边距 */
  :global(.wl-power) {
    margin-top: 0.5rem !important;
    font-size: 0.75rem !important;
  }

  .waline-wrapper {
    margin-top: 0.5rem;
  }
</style>
