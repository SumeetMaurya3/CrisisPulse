import jwt from "jsonwebtoken";

const GetUserInfo = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorised Request" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(404).json({ message: "Invalid Token" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error in GetUserInfo middleware:", error?.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export default GetUserInfo