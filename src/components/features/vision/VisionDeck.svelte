<script lang="ts">
	import type { VisionSlide } from "@/data/vision";
	import { onMount } from "svelte";

	interface Props {
		slides: VisionSlide[];
		prevLabel?: string;
		nextLabel?: string;
		hintLabel?: string;
		fullscreenLabel?: string;
		exitFullscreenLabel?: string;
	}

	let {
		slides,
		prevLabel = "上一页",
		nextLabel = "下一页",
		hintLabel = "← → 或空格切换幻灯片",
		fullscreenLabel = "全屏",
		exitFullscreenLabel = "退出全屏",
	}: Props = $props();

	let current = $state(0);
	let deckEl: HTMLDivElement | undefined = $state();
	let isFullscreen = $state(false);

	const total = $derived(slides.length);
	const slide = $derived(slides[current] ?? slides[0]);

	function goTo(index: number) {
		if (total === 0) {
			return;
		}
		current = ((index % total) + total) % total;
	}

	function prev() {
		goTo(current - 1);
	}

	function next() {
		goTo(current + 1);
	}

	function toggleFullscreen() {
		if (!deckEl) {
			return;
		}
		if (!document.fullscreenElement) {
			deckEl.requestFullscreen?.();
		} else {
			document.exitFullscreen?.();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "ArrowLeft" || event.key === "PageUp") {
			event.preventDefault();
			prev();
		} else if (
			event.key === "ArrowRight" ||
			event.key === "PageDown" ||
			event.key === " "
		) {
			event.preventDefault();
			next();
		} else if (event.key === "Home") {
			event.preventDefault();
			goTo(0);
		} else if (event.key === "End") {
			event.preventDefault();
			goTo(total - 1);
		}
	}

	function handleFullscreenChange() {
		isFullscreen = !!document.fullscreenElement;
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeydown);
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	});
</script>

<div
	bind:this={deckEl}
	class="vision-deck"
	class:is-fullscreen={isFullscreen}
	tabindex="0"
	role="region"
	aria-label="愿景幻灯片"
	aria-roledescription="carousel"
>
	<div class="vision-slide" aria-live="polite">
		<div class="vision-slide-inner">
			<p class="vision-index">{current + 1} / {total}</p>
			<h2 class="vision-title">{slide.title}</h2>
			{#if slide.subtitle}
				<p class="vision-subtitle">{slide.subtitle}</p>
			{/if}
			{#if slide.body}
				<p class="vision-body">{slide.body}</p>
			{/if}
			{#if slide.bullets?.length}
				<ul class="vision-bullets">
					{#each slide.bullets as bullet}
						<li>{bullet}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	<div class="vision-controls">
		<button type="button" class="vision-btn" onclick={prev} aria-label={prevLabel}>
			‹
		</button>
		<div class="vision-dots" role="tablist" aria-label="幻灯片页码">
			{#each slides as _, index}
				<button
					type="button"
					class="vision-dot"
					class:active={index === current}
					onclick={() => goTo(index)}
					aria-label={`第 ${index + 1} 页`}
					aria-selected={index === current}
					role="tab"
				></button>
			{/each}
		</div>
		<button type="button" class="vision-btn" onclick={next} aria-label={nextLabel}>
			›
		</button>
	</div>

	<div class="vision-footer">
		<span class="vision-hint">{hintLabel}</span>
		<button type="button" class="vision-fullscreen-btn" onclick={toggleFullscreen}>
			{isFullscreen ? exitFullscreenLabel : fullscreenLabel}
		</button>
	</div>
</div>

<style>
	.vision-deck {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-radius: calc(var(--radius-large) - 4px);
		background: linear-gradient(
			145deg,
			color-mix(in oklch, var(--primary) 12%, var(--card-bg)),
			var(--card-bg)
		);
		border: 1px solid var(--line-divider);
		padding: 1.25rem;
		outline: none;
	}

	.vision-deck.is-fullscreen {
		border-radius: 0;
		min-height: 100vh;
		justify-content: center;
	}

	.vision-slide {
		position: relative;
		min-height: min(58vh, 520px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
		border-radius: calc(var(--radius-large) - 8px);
		background: color-mix(in oklch, var(--card-bg) 88%, var(--primary) 12%);
		box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--primary) 18%, transparent);
	}

	.vision-deck.is-fullscreen .vision-slide {
		min-height: 70vh;
	}

	.vision-slide-inner {
		width: min(100%, 52rem);
		text-align: center;
		animation: vision-fade-in 0.35s ease;
	}

	.vision-index {
		margin: 0 0 1rem;
		font-size: 0.875rem;
		color: color-mix(in oklch, var(--primary) 70%, var(--text-color));
		letter-spacing: 0.08em;
	}

	.vision-title {
		margin: 0 0 0.75rem;
		font-size: clamp(1.75rem, 4vw, 2.75rem);
		font-weight: 700;
		color: var(--text-color);
		line-height: 1.2;
	}

	.vision-subtitle {
		margin: 0 0 1rem;
		font-size: clamp(1rem, 2.2vw, 1.35rem);
		color: color-mix(in oklch, var(--text-color) 72%, var(--primary) 28%);
	}

	.vision-body {
		margin: 0;
		font-size: clamp(1rem, 2vw, 1.2rem);
		line-height: 1.8;
		color: color-mix(in oklch, var(--text-color) 80%, transparent);
	}

	.vision-bullets {
		margin: 1.25rem auto 0;
		padding: 0;
		list-style: none;
		max-width: 40rem;
		text-align: left;
		display: grid;
		gap: 0.85rem;
	}

	.vision-bullets li {
		position: relative;
		padding-left: 1.25rem;
		line-height: 1.7;
		color: color-mix(in oklch, var(--text-color) 85%, transparent);
	}

	.vision-bullets li::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0.72em;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--primary);
		transform: translateY(-50%);
	}

	.vision-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.vision-btn {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		border: 1px solid var(--line-divider);
		background: var(--btn-regular-bg);
		color: var(--btn-content);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}

	.vision-btn:hover {
		background: var(--primary);
		color: white;
		transform: scale(1.05);
	}

	.vision-dots {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		max-width: 16rem;
	}

	.vision-dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
		border: none;
		background: color-mix(in oklch, var(--text-color) 25%, transparent);
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}

	.vision-dot.active {
		background: var(--primary);
		transform: scale(1.25);
	}

	.vision-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.vision-hint {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--text-color) 45%, transparent);
	}

	.vision-fullscreen-btn {
		border: 1px solid var(--line-divider);
		background: transparent;
		color: var(--btn-content);
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.vision-fullscreen-btn:hover {
		background: var(--btn-plain-bg-hover);
	}

	@keyframes vision-fade-in {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 640px) {
		.vision-slide {
			min-height: 48vh;
			padding: 1.5rem 1rem;
		}

		.vision-bullets {
			font-size: 0.9375rem;
		}
	}
</style>
