const express = require("express");

const {
    registerUser,
    loginUser,
    updateProfile,
    changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});
router.put("/profile", protect, updateProfile);
router.put("/change-password",protect,changePassword);


module.exports = router;