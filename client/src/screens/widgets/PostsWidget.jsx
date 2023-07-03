import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { configUrl } from "config";

const PostsWidget = ({ userId, page = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const getPosts = async () => {
    const response = await fetch(`${configUrl}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(`${configUrl}/posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getsavedPosts = async () => {
    const savedPosts = await fetch(`${configUrl}/users/${userId}/bookmarks`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await savedPosts.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = () => {
    if (page === "isProfile") {
      getUserPosts();
    } else if (page === "isSaved") {
      getsavedPosts();
    } else {
      getPosts();
    }
  };

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              page={page}
            />
          )
        )
      ) : (
        <Box
          // flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt="2rem"
        >
          <WidgetWrapper>
            <Typography variant="h6" component="h2" textAlign="center">
              No Post Found
            </Typography>
          </WidgetWrapper>
        </Box>
      )}
    </>
  );
};

export default PostsWidget;
