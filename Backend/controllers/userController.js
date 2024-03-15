import generateTokenAndSetCookie from "../Utils/helpers/generateTokenAndSetCookie.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


//-//-Get profile
const getUSerProfile = async (req, res) => {
    const {username} = req.params;
    try {
        const user = 
            await User.findOne({username}).select("-password").select("-updatedAt");
        if(!user) return res.status(400).json({error: "Không tìm thấy người dùng"});

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Err in getUserProfile: ", err.message);
    }
};

// - Đăng Ký User

const signupUser = async(req, res) => {
    try{
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});

        if (user) {
            return res.status(400).json({error:"User đã tồn tại"});
        }

        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password:hashedPassword,
        });
        await newUser.save();

        if(newUser) {
            // 
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                emailL: newUser.email,
                username: newUser.username,
            })
        } else {
            res.status(400).json({error: "Không tìm thấy data người dùng"})
        }

    }catch (err) {
        res.status(500).json({error: err.message});
        console.log("error in signupUser: ", err.message)
    }
};

// - Đăng Nhập User
// user test: username: nghao || password: Nguyenhao123

const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        

        if(!user || !isPasswordCorrect) return res.status(400).json({
            error: "Tên đăng nhập hoặc mật khẩu không đúng"
        });

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in loginUser: ", error.message);
    }
}

//- Đăng xuất User

const logoutUser = (req, res) => {

    try {
        res.cookie("jwt", "", {maxAge:1});
        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in logoutUser: ", err.message);
    }
};

//-Follow_UnfollowUser

const followUnfollowUser = async(req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({ 
            error: "Không thể follow/unfollow chính mình" 
        });

        if (!userToModify || !currentUser) return res.status(400).json({
            error: "Không tìm thấy người dùng"
        });

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing) {
            //Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id }});
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: " Đã hủy theo dõi" });
        }else{
            //follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "Đã theo dõi" });
        }

    } catch (err) {
          res.status(500).json({ message: err.message });
          console.log("Error in followUnfollowUser: ", err.message);      
    }
};

//-Update UserProfile

const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ 
            error: "Không tìm thấy người dùng" 
        });

        if(req.params.id !== userId.toString()) return res.status(400).json({
            error: "Không thể cập nhập thông tin người dùng khác"
        });
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            user.password = hashPassword;
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({
            message: "Đã cập nhật thông tin người dùng", user
        });

    } catch (err) {
            res.status(500).json({ message: err.message });
            console.log("Error in updateUser: ", err.message);
    }
};




export { signupUser, loginUser, logoutUser, 
        followUnfollowUser, updateUser, 
        getUSerProfile 
        };

