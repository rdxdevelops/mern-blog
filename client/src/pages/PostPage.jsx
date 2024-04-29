import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";

export default function PostPage() {
  const { postSlug } = useParams();
  const { state: currentPost } = useLocation();
  const [post, setPost] = useState(currentPost);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        
        if (res.ok) {
          setPost(data.posts[0]);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    currentPost ? setPost(currentPost) : fetchPost();
  }, [postSlug, currentPost]);

  if (!post && !error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center p-6 text-3xl text-red-500">
          Something went wrong. Please try again...
        </p>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5">
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>
      <img
        src={post.image}
        alt={post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {new Date(post.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
        <span className="italic">
          {Math.round(post.content.length / 1000)} mins read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="post-content p-3 max-w-2xl w-full mx-auto"></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
    </main>
  );
}
