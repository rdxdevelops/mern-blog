import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({
  comment,
  onLike,
  onEditComment,
  onDeleteComment,
}) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  }, [comment.userId]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEditComment(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm ">
      <div className="flex-shrink-0 mr-3">
        <img
          className="h-10 w-10 object-cover rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={`${user.username} profile picture`}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "Anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                onClick={handleSave}
                gradientDuoTone="purpleToBlue"
                type="button"
                size="sm">
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                outline
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="pt-2 border-t  dark:border-gray-700 max-w-fit flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-sm text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}>
                <FaThumbsUp />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      type="button"
                      className="text-gray-400 hover:text-blue-500">
                      Edit
                    </button>
                    <button
                      onClick={onDeleteComment}
                      type="button"
                      className="text-gray-400 hover:text-red-500">
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
