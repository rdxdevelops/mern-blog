import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { state: currentPost } = useLocation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          return;
        }
        if (res.ok) {
          setError(null);
          setFormData(data.posts[0]);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    currentPost ? setFormData(currentPost) : fetchPost();
  }, [postId, currentPost]);

  const handleUploadImage = async () => {
    try {
      if (!imageFile) {
        setImageFileUploadError("Please select an image");
        return;
      }
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageFileUploadError("Error uploading image");
          setImageFileUploadProgress(null);
          setImageFile(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({ ...formData, image: downloadUrl });
            setImageFileUploadError(null);
            setImageFileUploadProgress(null);
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image upload failed.");
      setImageFileUploadProgress(null);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      if (res.ok) {
        setError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setError("Something went wrong. Try Again.");
    }
  };
  return (
    <div className="p-3 max-w-3xl min-h-screen mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TextInput
            type="text"
            required
            placeholder="Title"
            id="title"
            className="flex-1"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category || "uncategorized"}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">ReactJS</option>
            <option value="nextjs">NextJS</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}>
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image || ""}
            alt="uploaded image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {error && <Alert color="failure">{error}</Alert>}
      </form>
    </div>
  );
}
