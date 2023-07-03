import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        replies: {
            type: [ {
                type: mongoose.Schema.ObjectId,
                ref: 'Comment',
            }],
            default: [],
        },
        parentId: {
            type: String,
        },
        likes: {
            type: Map,
            of: Boolean,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
)
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

