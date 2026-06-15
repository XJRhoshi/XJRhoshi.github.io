export interface VisionSlide {
	title: string;
	subtitle?: string;
	bullets?: string[];
	body?: string;
}

export const visionMeta = {
	title: "愿景版",
	subtitle: "面向未来的方向与承诺，像演示文稿一样一页页展开。",
};

/** 编辑此数组即可更新幻灯片内容 */
export const visionSlides: VisionSlide[] = [
	{
		title: "愿景版",
		subtitle: "星间润 · HoshikanUru",
		body: "Thinking will not overcome fear but action will.",
	},
	{
		title: "四个方向",
		bullets: [
			"承担更多责任，认识更多的人",
			"以智能医疗毕业设计为原点，向 AI / 嵌入式 / 物联网延伸",
			"保持对神经生物学、地理学、社会学的热爱",
			"音乐、编曲与 AI 绘画持续进行",
		],
	},
	{
		title: "学术与技术",
		bullets: [
			"STM32 智能语音与物联网实践",
			"AI Infra、DeepSeek 加速与深度学习新算法",
			"智能软件开发与工程细节",
			"科学可以是工具，也可以是发自热爱的探索",
		],
	},
	{
		title: "人文与艺术",
		bullets: [
			"继续阅读与写作，记录思考与旅程",
			"艺术是处理情绪与空洞的方式",
			"政治意味着责任，也意味着理性地处理资源与权力",
			"在真实世界里重建自己的体系",
		],
	},
	{
		title: "关系与成长",
		bullets: [
			"主动结交线上线下的朋友，友好与付出",
			"对占有心态脱敏，不把一方面的痛苦占据全部",
			"真正的爱是两个有体系的人，共同创造世界",
			"失败意味着新的开始，意味着成长",
		],
	},
	{
		title: "现在就开始",
		subtitle: "不要等待「准备好了」",
		body: "未来不一定如你所愿，但只要开始做你想做的事，结果一定会出乎你的意料——而且你一定会快乐。",
	},
];
