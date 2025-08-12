import passport from 'passport';
import local from 'passport-local';
import User from '../../models/FirstDB/user.model.js';
import Student from '../../models/FirstDB/student.model.js';
import { Organization } from '../../models/FirstDB/organization.model.js';
import { getPlanFeaturesMap } from '../accessCheckerForPlan/getPlanFeature.js';
import mongoose, { get } from 'mongoose';  // Import mongoose here
import { getRoleFeatureMap } from '../accessCheckerForRole/getRoleFeature.js';

const LocalStrategy = local.Strategy;

// User local strategy
passport.use('user-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
      return done(null, false, { message: 'User not found.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, { ...user.toObject(), role: 'user' });
  } catch (error) {
    return done(error);
  }
}));

// Student local strategy
passport.use('student-local', new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const student = await Student.findOne({ email: email }).select('+password').populate('organizationId', 'planPurchased');
    if (!student) {
      return done(null, false, { message: 'Student not found.' });
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    const planFeatures = student.organizationId ? await getPlanFeaturesMap(student.organizationId.planPurchased) : null;
    return done(null, { ...student.toObject(), role: 'student', planFeatures: planFeatures });
  } catch (error) {
    return done(error);
  }
}));

// Organization local strategy
passport.use('org-local', new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const org = await Organization.findOne({ email: email }).select('+password');
    if (!org) {
      return done(null, false, { message: 'Organization not found.' });
    }
    const isMatch = await org.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, { ...org.toObject(), role: 'organization' });
  } catch (error) {
    return done(error);
  }
}));

// Institute login strategy (handles both organization and user logins)
passport.use('institute-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const org = await Organization.findOne({ email }).select('+password planPurchased');
    if (org) {
      const isMatch = await org.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      const planFeatures = await getPlanFeaturesMap(org.planPurchased);
      const metaData = await org.getFullMetadata();

      return done(null, {
        ...org.toObject(),
        role: 'organization',
        planFeatures,
        metaData
      });
    }

    const user = await User.findOne({ email }).select('+password').populate('organizationId', 'planPurchased');
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      const planId = user.organizationId?.planPurchased || null;
      const roleFeatures=user.roleId ? await getRoleFeatureMap(user.roleId) : {};
      let planFeatures = {};
      let metaData = {};
      if (roleFeatures && Object.keys(roleFeatures).length > 0) {
        console.log('Role features found:', roleFeatures);
         planFeatures = planId ? await getPlanFeaturesMap(planId) : {};
        metaData = user.organizationId ? await user.organizationId.getFullMetadata(roleFeatures,planFeatures) : {};
      }



      return done(null, {
        ...user.toObject(),
        role: 'user',
        planFeatures,
        metaData,
        roleFeatures
      });
    }

    return done(null, false, { message: 'No user or organization found with this email.' });
  } catch (err) {
    return done(err);
  }
}));

// Serializing the user into the session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id, 'Role:', user.role); // Log serialization
  done(null, { id: user._id, role: user.role });
});

// Deserializing the user from the session
passport.deserializeUser(async (object, done) => {
  try {
    console.log('=== DESERIALIZATION START ===');
    console.log('Session object received:', JSON.stringify(object));

    // Validate session object
    if (!object || typeof object !== 'object') {
      console.error('Invalid session object - not an object:', typeof object);
      return done(null, false);
    }

    if (!object.id || !object.role) {
      console.error('Missing required fields in session object:', {
        hasId: !!object.id,
        hasRole: !!object.role,
        id: object.id,
        role: object.role
      });
      return done(null, false);
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(object.id)) {
      console.error('Invalid ObjectId format:', object.id);
      return done(null, false);
    }

    let user = null;
    let planFeatures = {};
    let metaData = {};
    let roleFeatures = {};

    console.log(`Attempting to deserialize ${object.role} with ID: ${object.id}`);

    // Fetch user based on role and ID
    switch (object.role) {
      case 'student': {
        console.log('Deserializing student...');
        user = await Student.findById(object.id)
          .populate('organizationId', 'planPurchased')
          .lean(); // Using lean() for better performance

        if (!user) {
          console.error('Student not found for ID:', object.id);
          return done(null, false);
        }

        console.log('Student found:', { id: user._id, email: user.email });

        if (user.organizationId && user.organizationId.planPurchased) {
          planFeatures = await getPlanFeaturesMap(user.organizationId.planPurchased);
        }

        return done(null, { ...user, role: 'student', planFeatures });
      }

      case 'organization': {
        console.log('Deserializing organization...');
        user = await Organization.findById(object.id);

        if (!user) {
          console.error('Organization not found for ID:', object.id);
          return done(null, false);
        }

        console.log('Organization found:', { id: user._id, email: user.email });

        if (user.planPurchased) {
          planFeatures = await getPlanFeaturesMap(user.planPurchased);
        }
        metaData = await user.getFullMetadata(roleFeatures,planFeatures);

        return done(null, { ...user.toObject(), role: 'organization', planFeatures, metaData });
      }

      case 'user':
      default: {
        console.log('Deserializing user...');
        user = await User.findById(object.id)
          .populate('organizationId', 'planPurchased');

        if (!user) {
          console.error('User not found for ID:', object.id);
          return done(null, false);
        }

        roleFeatures = user.roleId ? await getRoleFeatureMap(user.roleId) : {};

        if (user.organizationId && user.organizationId.planPurchased && Object.keys(roleFeatures).length > 0) {
          planFeatures = await getPlanFeaturesMap(user.organizationId.planPurchased);
          metaData = await user.organizationId.getFullMetadata(roleFeatures,planFeatures);
        }



        return done(null, { ...user.toObject(), role: 'user', planFeatures, roleFeatures, metaData });
      }
    }
  } catch (error) {
    console.error('=== DESERIALIZATION ERROR ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return done(error);
  } finally {
    console.log('=== DESERIALIZATION END ===');
  }
});

export default passport;
