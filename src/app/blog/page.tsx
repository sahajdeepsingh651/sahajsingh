    import Link from "next/link";

    const posts = [
      { id: "post-1", title: "First Post", date: "2026" },
      { id: "post-2", title: "Second Post", date: "2025" },
    ];

    export default function BlogPage() {
      // Step 1: Transform your data array into a list of <li> elements
      const postListItems = posts.map(function (post) {
        return (
          <li key={post.id} className="flex justify-between">
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
            <span>{post.date}</span>
          </li>
        );
      });

      // Step 2: Render your clean HTML!
      return (
        <div>
          <h1>Blog</h1>
          <ul>{postListItems}</ul>
        </div>
      );
    }

