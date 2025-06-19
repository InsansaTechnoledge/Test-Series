import { Schema,Types } from "mongoose";

const adminUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
        validator: function(v) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
        validate: {
            validator: function(value) {
                return value.length >= 8; // Minimum length of 8 characters
            },
            message: 'Password must be at least 8 characters long'
        }
    },
}, { timestamps: true, versionKey: false }
);

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;