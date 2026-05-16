import jwt from "jsonwebtoken";

const protectMiddleware = (req, res) => {
  const token = req?.cookies?.token;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    res.status(200).json({
      s: true,
      user: req?.user,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default protectMiddleware;
