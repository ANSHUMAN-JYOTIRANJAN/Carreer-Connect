import { getAboutUser, getAllUser } from "@/config/redux/action/authAction";
import { getAllPosts, createPost } from "@/config/redux/action/postAction";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";

// import { useRouter} from "next/navigation";

export default function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const router = useRouter();
  const [isTokenThere, setIsTokenThere] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    } else {
      setIsTokenThere(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isTokenThere) return;

    dispatch(getAllPosts());
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUser());
    }
  }, [isTokenThere]);

  const [postContent, setPostContent] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    setFileList((prev) => [...prev, ...newFiles].slice(0, 5)); // max 5
    // reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    await dispatch(createPost({ body: postContent, files: fileList }));
    setPostContent("");
    setFileList([]);
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {/* CREATE POST CARD */}
        <div className={styles.createPostComponent}>
          <div className={styles.postInputWrapper}>
            {authState.profileFetched &&
              (authState.user?.userId?.profilePicture ? (
                <img
                  className={styles.userProfile}
                  src={`${BASE_URL}/uploads/${authState.user.userId.profilePicture}`}
                  alt="profile"
                />
              ) : (
                <div className={styles.defaultAvatar}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              ))}
            <textarea
              onChange={(e) => setPostContent(e.target.value)}
              value={postContent}
              placeholder="What's on your mind?"
              className={styles.textAreaContent}
              name="postContent"
              id="postContent"
            ></textarea>
          </div>

          {/* PHOTO PREVIEW STRIP */}
          {fileList.length > 0 && (
            <div className={styles.previewStrip}>
              {fileList.map((file, idx) => (
                <div key={idx} className={styles.previewThumb}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                  />
                  <button
                    className={styles.removeThumb}
                    onClick={() => handleRemoveFile(idx)}
                    title="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ACTIONS ROW */}
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "8px" }}
          >
            <label htmlFor="fileUpload" className={styles.uploadLabel}>
              <div className={styles.favSection}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span>Photo {fileList.length > 0 ? `(${fileList.length}/5)` : ""}</span>
              </div>
            </label>
            <input
              onChange={handleFileAdd}
              type="file"
              hidden
              id="fileUpload"
              accept="image/*,video/*"
            />
            {(postContent.length > 0 || fileList.length > 0) && (
              <button onClick={handleUpload} className={styles.postButton}>
                Post
              </button>
            )}
          </div>
        </div>

        {/* POSTS FEED */}
        <div className={styles.postContainer}>
          {postState.posts &&
            postState.posts.map((post) => (
              <div key={post._id} className={styles.singleCard}>
                <div className={styles.singleCard_header}>
                  <img
                    className={styles.userProfile}
                    src={
                      post.user?.profilePicture
                        ? `${BASE_URL}/uploads/${post.user.profilePicture}`
                        : `${BASE_URL}/uploads/default.jpg`
                    }
                    alt="profile"
                  />
                  <div>
                    <h4>{post.user?.name}</h4>
                    <span className={styles.postTime}>Just now</span>
                  </div>
                  <button className={styles.deleteButton} title="Delete post">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
                <div className={styles.singleCard_image}>
                  {Array.isArray(post.media) && post.media.length > 0
                    ? post.media.map((src, idx) => (
                        <img
                          key={idx}
                          src={`${BASE_URL}/uploads/${src}`}
                          alt={`post-media-${idx}`}
                        />
                      ))
                    : post.media && (
                        <img
                          src={`${BASE_URL}/uploads/${post.media}`}
                          alt="post-media"
                        />
                      )}
                </div>
                <div className={styles.postBody}>
                  <p>{post.body}</p>
                </div>
              </div>
            ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
