import User from '../models/User.js';
import Post from '../models/Post.js';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("isBookmarked>>>",user.bookmarks, user.bookmarks.includes(postId))
    // Check if the post is already bookmarked by the user
    const isBookmarked = user.bookmarks.includes(postId);
    if (isBookmarked) {
      user.bookmarks.pull(postId);
    }else {
      user.bookmarks.push(postId);
    }
    const savedUser = await user.save();
    res.status(200).json(savedUser.bookmarks);
    // res.status(200).json({ message: 'Post bookmarked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookmarkedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find the user by userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(userId,user)
    // Retrieve the bookmarked posts for the user
    const bookmarkedPosts = await Post.find({ _id: { $in: user.bookmarks } });
    console.log(bookmarkedPosts)

    res.status(200).json(bookmarkedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};