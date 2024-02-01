const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const user_balence = await Account.findOne({
        userId: req.userId,
    });

    res.json({
        balance: user_balence.balance,
    });
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    const { ammount, to } = req.body;

    const fromAccount = await Account.findOne({
        userId: req.userId,
    });

    if (!fromAccount || ammount > fromAccount.balance) {
        await session.abortTransaction();

        return res.status(400).json({
            message: "Insufficient Balance",
        });
    }

    const toAccount = await Account.findOne({
        userId: to,
    });

    if (!toAccount) {
        await session.abortTransaction();

        return res.status(400).json({
            message: "Account not found",
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -ammount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: ammount } }).session(session);

    await session.commitTransaction();

    return res.json({
        message: "Transfer Successful",
    });
});

module.exports = router;
