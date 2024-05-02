import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: currentUser._id,
          content: comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCommentError(data.message);
      }
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setAllComments((prev) => [data, ...prev]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      const fetchComments = async () => {
        const res = await fetch(`/api/comment/getpostcomments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setAllComments(data);
          setLoading(false);
        }
        if (!res.ok) {
          setLoading(false);
        }
      };

      fetchComments();
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setAllComments(
          allComments.map((comment) => {
            return comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                }
              : comment;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = (comment, editedContent) => {
    setAllComments(
      allComments.map((c) => {
        return c._id === comment._id ? { ...c, content: editedContent } : c;
      })
    );
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setShowModal(false);
        setAllComments(
          allComments.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="w-5 h-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm my-5 text-teal-500">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="ml-1 text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 p-3 rounded-md">
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}></Textarea>
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" outline>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {loading && <p className="text-center my-5">Loading...</p>}

      {allComments.length === 0 && !loading ? (
        <p className="text-sm my-5"> No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p className="">Comments</p>
            <div className="border borderd-gray-400 py-1 px-2 rounded-sm">
              <p>{allComments.length}</p>
            </div>
          </div>
          {allComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEditComment={handleEditComment}
              onDeleteComment={() => {
                setShowModal(true);
                setCommentIdToDelete(comment._id);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        popup
        size="md"
        onClose={() => setShowModal(false)}>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
