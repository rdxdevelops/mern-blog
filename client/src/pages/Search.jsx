import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const sortFromURL = urlParams.get("sort");
    const categoryFromURL = urlParams.get("category");

    if (searchTermFromURL || sortFromURL || categoryFromURL) {
      setSidebarData((sidebarData) => ({
        ...sidebarData,
        ...(searchTermFromURL && { searchTerm: searchTermFromURL }),
        ...(sortFromURL && { sort: sortFromURL }),
        ...(categoryFromURL && { category: categoryFromURL }),
      }));
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setLoading(false);
        setPosts(data.posts);
        setShowMore(data.posts.length === 9 ? true : false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);

    Object.keys(sidebarData).forEach((e) => {
      urlParams.set(e, sidebarData[e]);
    });

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* sidebar section for search filters */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={(e) =>
                setSidebarData({
                  ...sidebarData,
                  searchTerm: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onChange={(e) =>
                setSidebarData({ ...sidebarData, sort: e.target.value })
              }
              value={sidebarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={(e) =>
                setSidebarData({ ...sidebarData, category: e.target.value })
              }
              value={sidebarData.category}>
              <option value="">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">ReactJS</option>
              <option value="nextjs">NextJS</option>
              <option value="uncategorized">Uncategorized</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>

      {/* search results section */}

      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <div className="flex justify-center">
            <button
              onClick={handleShowMore}
              className="self-center text-teal-500 py-7 text-lg">
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
