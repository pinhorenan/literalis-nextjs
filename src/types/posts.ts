export default interface Post {
    id: string;
    authorId: string;
    createdAt: string;
    excerpt: string;
    bookIsbn: string;
    progressPct: number;
    comments?: [];
}