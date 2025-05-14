import passport from 'passport';
import local from 'passport-local';
import User from '../../models/FirstDB/user.model.js';
import Student from '../../models/FirstDB/student.model.js';
import {Organization} from '../../models/FirstDB/organization.model.js';

const LocalStrategy = local.Strategy; 

passport.use('user-local',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email}).select('+password');
            console.log("😏",user);
            if (!user) {
                return done(null, false, { message: 'User not found.' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }   
            console.log("😏",user.toObject());
            return done(null, {...user.toObject(), role: user.roleId });

        } catch (error) {
            return done(error);
        }
    }
));

passport.use('student-local',
    new LocalStrategy({
        usernameField: 'email'
    },
    async (email, password, done) => {
        try {
            const student = await Student.findOne({ email: email}).select('+password');
            if (!student) {
                return done(null, false, { message: 'Student not found.' });
            }
            const isMatch = await student.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }       
            return done(null, {...student.toObject(), role: 'student' });

        } catch (error) {
            return done(error);
        }
    }
));

passport.use('org-local',
    new LocalStrategy({
        usernameField: 'email'
    },
    async (email, password, done) => {
        try {
            const org = await Organization.findOne({ email: email}).select('+password');
            if (!org) {
                return done(null, false, { message: 'Organization not found.' });
            }   
            const isMatch = await org.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, {...org.toObject(), role: 'organization' });
        } catch (error) {
            return done(error);
        }       
    }
));


passport.serializeUser((user, done) => {
      console.log("🚀 ~ file: passport.js:70 ~ passport.serializeUser ~ user:", user)
    done(null,{id:user._id,role:user.roleId} );
  
});
passport.deserializeUser(async (object, done) => {
    try {
        if(object.role === 'student') {
            const student = await Student.findById(object.id);
            done(null, student?{...student.toObject(), role: 'student'} : false);
        }
        else if(object.role === 'organization') {
            const org = await organization.findById(object.id);
            done(null, org?{...org.toObject(), role: 'organization'} : false);
        }
        else {
            const user = await User.findById(object.id);
            done(null, user?{...user.toObject(), role: user.roleId} : false);
        }

    } catch (error) {
        done(error);
    }
});

export default passport;
