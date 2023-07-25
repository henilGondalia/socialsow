import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Typography } from "@mui/material";
import useApi from "customHooks/useApi";

const PostsWidget = ({ userId, page = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const { fetchData } = useApi();

  const getPosts = async () => {
    const data = await fetchData(`posts`, "GET", null, token);
    if (data) {
      dispatch(setPosts({ posts: data }));
    }
  };

  const getUserPosts = async () => {
    const data = await fetchData(`posts/${userId}/posts`, "GET", null, token);
    if (data) {
      dispatch(setPosts({ posts: data }));
    }
  };

  const getsavedPosts = async () => {
    const data = await fetchData(
      `users/${userId}/bookmarks`,
      "GET",
      null,
      token
    );
    if (data) {
      dispatch(setPosts({ posts: data }));
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      dispatch(setPosts({ posts: [] }));
    };
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
