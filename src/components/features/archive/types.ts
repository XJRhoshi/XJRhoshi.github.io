export interface ArchivePanelProps {
	sortedPosts: Post[];
}

export interface Post {
	id: string;
	url?: string;
	data: {
		title: string;
		tags: string[];
		categories: string[];
		published: string;
		alias?: string;
		permalink?: string;
	};
}
