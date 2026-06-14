// 友情链接数据配置，用于 `/friends/` 页面卡片。
// 在 friendsData 中增删改条目即可；每项 id 需在数组内唯一。部署前可检查头像外链是否可被浏览器加载（防盗链可能导致裂图）。

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "250king",
		imgurl: "https://q.qlogo.cn/g?b=qq&nk=2789260300&s=0",
		desc: "耀",
		siteurl: "https://250king.top",
		tags: ["Friends"],
	},
	{
		id: 2,
		title: "EnRonG",
		imgurl: "https://cdn.nodeimage.com/i/TyiFoWTcNcCWD2apXW7Y1XthLe6nNxYC.png",
		desc: "Keep being a better EnRonG.",
		siteurl: "https://enrong.me",
		tags: ["Friends"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
