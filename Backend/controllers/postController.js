import Post from "../models/postModel.js";
import User from "../models/userModel.js";



//  - Tạo bài viết
const createPost = async (req, res) => {
    try {
        const {postedBy, text, img} = req.body; 

        if(!postedBy || !text) {
            return res.status(400).json({ message: "Hãy viết gì đó" })
        };

        const user = await User.findById(postedBy);
        if(!user){
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        };

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Không thể thực hiện post"});
        };

        const maxLength = 500;
        if(text.length > maxLength) {
            return res.status(400).json({message: `Nội dung không được vượt quá ${maxLength} kí tự`})
        }

        const newPost = new Post({ postedBy, text, img});

        await newPost.save();
        
        res.status(201).json({ message: "Bài viết được đăng thành công", newPost });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
    }
};

// - Get bài viết
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({message: "Không tìm thấy bài viết"});
        }

        res.status(200).json({ post });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// - Xóa bài viết
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params,id);
        if(!post) {
            return res.status(404).json({ message: "Không tìm thấy bài viết" });            
        }

        if(post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Không thể xóa bài viết" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Đã xóa bài viết" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// - Like/UnLike bài viết
const likeUnLikePost = async (res, req) =>{
    try {
        const {id: postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({ message: "Không tìm thấy bài viết" });
        }

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost){
            //Unlike post
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}})
            res.status(200).json({message: "Đã Unlike"});
        }else{
            post.likespush(userId);
            await post.save();
            res.status(200).json({message: "Đã like"});
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// - Reply bài viết
const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Hãy nhập gì đó" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Không tìm thấy post" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// - Get feed
const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" })
        }

        const following = user.following;

        const feedPosts = await Post.find({
            postedBy: {$in:following}}).sort({createdAt: -1});

        res.status(200).json({feedPosts});    

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export  { createPost, getPost, deletePost, 
    likeUnLikePost, replyToPost, getFeedPosts };

////// login_signIn