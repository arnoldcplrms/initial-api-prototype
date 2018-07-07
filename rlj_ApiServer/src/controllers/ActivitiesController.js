const Activities = require('../models/Activities');
const timeStamp = require('../helper/timestamp');
module.exports = (mongoose) => {

    const errorHandler = (error, res) => {
        console.log(error);
        res.status(500).json({
            err: error
        })
    }
    return {
        async GetActivityLogById(req, res) {
            try {
                const result = await Activities.find({
                    "AccountId": req.body.id
                }).exec();
                res.send(result);
            } catch (error) {
                errorHandler(error, res)
            }
        },

        async LogActivity(req, res) {
            try {
                const body = req.body;
                const activity = new Activities({
                    _id: new mongoose.Types.ObjectId(),
                    AccountId: body.AccountId,
                    Activity: body.Activity,
                    IsMobile: body.IsMobile,
                    MacAddress: body.MacAddress,
                    Seen: false,
                    Explanation: {
                        Body: "",
                        TimeStamp: ""
                    },
                    SeenBy: {
                        AccountId: "",
                        FirstName: "",
                        TimeStamp: ""
                    }
                })
                await activity.save();
                res.send({
                    message: `Inserted succesfully`
                })
            } catch (error) {
                errorHandler(error, res)
            }
        },

        async DeleteActivity(req, res) {
            try {
                await Activities.deleteOne({
                    "_id": new mongoose.Types.ObjectId(req.body.id)
                }).exec();

                res.send({
                    message: `Deleted succesfully`
                });
            } catch (error) {
                errorHandler(error, res)
            }
        },

        async AddExplanation(req, res) {
            const body = req.body;
            try {
                await Activities.update({
                    "_id": new mongoose.Types.ObjectId(req.body.id)
                }, {
                    $set: {
                        Explanation: {
                            Body: body.Explanation,
                            TimeStamp: timeStamp(),
                        }
                    }
                }).exec();

                const result = await Activities.findOne({
                    "_id": new mongoose.Types.ObjectId(req.body.id)
                }).exec();

                res.send({
                    message: "Explanation added Successfully",
                    updatedData: result
                });

            } catch (error) {
                errorHandler(error, res)
            }
        },

        async SetAsSeen(req, res) {
            const body = req.body;
            try {
                await Activities.update({
                    "_id": new mongoose.Types.ObjectId(body.id)
                }, {
                    $set: {
                        Seen: true,
                        SeenBy: {
                            AccountId: body.AccountId,
                            TimeStamp: timeStamp(),
                            FirstName: body.FirstName
                        }
                    }
                }).exec();

                res.send({
                    message: "Updated to seen Successfully",
                    body
                });
            } catch (error) {
                errorHandler(error, res);
            }
        }
    }
}