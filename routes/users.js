import express from "express";

const router = express.Router();

const users = [
    {
        id: 1,
        name: "issa",
        email: "issabaloach03@gmail.com"
    }
];

// Get all users
router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        data: users,
        message: "Users fetched successfully"
    });
});

// Add a new user
router.post("/", (req, res) => {
    const { name, email } = req.body;
    users.push({ name, email, id: users.length + 1 });
    res.status(201).json({
        error: false,
        data: users,
        message: "User added successfully"
    });
});

// Get a user by ID
router.get("/:id", (req, res) => {
    const user = users.find((data) => data.id == req.params.id);
    if (!user) {
        return res.status(404).json({
            error: true,
            data: null,
            message: "User not found"
        });
    }
    res.status(200).json({
        error: false,
        data: user,
        message: "User fetched successfully"
    });
});

export default router;
