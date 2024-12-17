import User from "../models/user.module.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie  from "../utils/generateToken.js"

export const signup = async(req, res) => {
    try{
        const {username , fullName ,  email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}
         const existingEmail = await User.findOne({email}) 
         const existingUsername = await User.findOne({username})
 
         if (existingEmail || existingUsername){
             return res.status(400).json({error: "Already existing User"})
         }
 
     if(password.length< 6){
         return res.status(400).json({eror: "Passord mus have atleast 6 characters length"})
     }
 
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password , salt);
 
 
     const newUser = new User({
         username,
         fullName,
         email,
         password : hashedPassword
 
     })
 
 
     if(newUser){
        generateTokenAndSetCookie(newUser._id, res);
         await newUser.save();
         res.status(200).json({
             _id : newUser._id,
         username: newUser.username,
         fullName: newUser.fullName,
         email: newUser.email,
         followers: newUser.followers,
         following: newUser.following,
         profileImg: newUser.profileImg,
         coverImg: newUser.coverImg,
         bio  : newUser.bio,
         link : newUser.link
 })
     }
     else{
         res.status(400).json({error:"Invalid user data"})
     }
 
    }catch(error){
        console.log(`error in signup controller :${error}`)
        res.status(500).json({error : "Internal Server Error"})
    }
   
}

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
	} catch (error) {
		console.log(`Error in login controller, ${error}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "" , { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log(`Error in logout controller, ${error}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMe = async (req , res) => {
	try {
		const user = await User.findOne({_id : req.user._id}).select("-password");
        
		res.status(200).json(user);
	} catch (error) {
		console.log(`Error in getMe controller: ${error}`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};