import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowUp,
  HiDocumentText,
  HiOutlineUsers,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user/getusers?limit-5");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.usersAddedLastMonth);
      }
    };

    const fetchComments = async () => {
      const res = await fetch("/api/comment/getcomments?limit=5");
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setTotalComments(data.totalComments);
        setLastMonthComments(data.lastMonthsComments);
      }
    };

    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts?limit=5");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthsPosts);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUsers className="bg-teal-600 text-white text-5xl rounded-full p-3 shadow-lg" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowUp /> {lastMonthUsers}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white text-5xl rounded-full p-3 shadow-lg" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowUp /> {lastMonthComments}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white text-5xl rounded-full p-3 shadow-lg" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowUp /> {lastMonthPosts}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
      </div>

      {/* the three lists */}

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* Recent users */}

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between text-sm font-semibold p-3">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {users &&
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="bg-white dark:bg-gray-800 dark:border-gray-700">
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent comments */}

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between text-sm font-semibold p-3">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Comment</TableHeadCell>
              <TableHeadCell>Likes</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {comments &&
                comments.map((comment) => (
                  <TableRow
                    key={comment._id}
                    className="bg-white dark:bg-gray-800 dark:border-gray-700">
                    <TableCell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent posts */}

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between text-sm font-semibold p-3">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Post Image</TableHeadCell>
              <TableHeadCell>Post Title</TableHeadCell>
              <TableHeadCell>Post Category</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {posts &&
                posts.map((post) => (
                  <TableRow
                    key={post._id}
                    className="bg-white dark:bg-gray-800 dark:border-gray-700">
                    <TableCell >
                      <img src={post.image} alt="post image" className="w-14 h-10 object-cover rounded-md bg-gray-500"/>
                    </TableCell>
                    <TableCell className="w-96" >{post.title}</TableCell>
                    <TableCell className="w-5 ">{post.category}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
