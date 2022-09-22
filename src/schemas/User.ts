import {model, Schema} from "mongoose";
import {IUser} from "../types";

const UserSchema = new Schema<IUser>({
    userID: {required: true, type: String},
    userName: {required: true, type: String},
    lastTimeStamp: {required: true, type: Date},
    lastTimeTyp: {required: true, type: String},
    onlineTime: {
        online: {type: Number, default: 0},
        idle: {type: Number, default: 0},
        dnd: {type: Number, default: 0},
    }
})

const UserModel = model("user", UserSchema)

export default UserModel