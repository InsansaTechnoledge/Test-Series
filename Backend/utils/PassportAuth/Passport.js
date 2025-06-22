import passport from 'passport';
import local from 'passport-local';
import User from '../../models/FirstDB/user.model.js';
import Student from '../../models/FirstDB/student.model.js';
import { Organization } from '../../models/FirstDB/organization.model.js';
import { getPlanFeaturesMap } from '../accessCheckerForPlan/getPlanFeature.js';
import mongoose from 'mongoose';  // Make sure to import mongoose

const LocalStrategy = local.Strategy;

// User local strategy
passport.use('user-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select('+password');
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
    const student = await Student.findOne({ email }).select('+password').populate('organizationId', 'planPurchased');
    if (!student) {
      return done(null, false, { message: 'Student not found.' });
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    const planFeatures = student.organizationId ? await getPlanFeaturesMap(student.organizationId.planPurchased) : null;
    return done(null, { ...student.toObject(), role: 'student', planFeatures });
  } catch (error) {
    return done(error);
  }
}));

// Organization local strategy
passport.use('org-local', new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const org = await Organization.findOne({ email }).select('+password');
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

      return done(null, { ...org.toObject(), role: 'organization', planFeatures, metaData });
    }

    const user = await User.findOne({ email }).select('+password').populate('organizationId', 'planPurchased');
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      const planId = user.organizationId?.planPurchased || null;
      const planFeatures = planId ? await getPlanFeaturesMap(planId) : {};

      return done(null, { ...user.toObject(), role: 'user', planFeatures });
    }

    return done(null, false, { message: 'No user or organization found with this email.' });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id, 'Role:', user.role);
  done(null, { id: user._id, role: user.role });
});

passport.deserializeUser(async (object, done) => {
  try {
    console.log('=== DESERIALIZATION START ===');
    console.log('Session object received:', object);

    if (!object || !object.id || !object.role) {
      console.error('Invalid session object:', object);
      return done(null, false);  // Invalid session object
    }

    let user = null;
    let planFeatures = {};
    let metaData = {};

    // Check for correct role and fetch user data
    switch (object.role) {
      case 'student': {
        console.log('Deserializing student...');
        user = await Student.findById(object.id).populate('organizationId', 'planPurchased').lean();
        if (!user) {
          console.error('Student not found for ID:', object.id);
          return done(null, false);
        }
        console.log('Student found:', user);

        if (user.organizationId) {
          planFeatures = await getPlanFeaturesMap(user.organizationId.planPurchased);
        }

        return done(null, { ...user, role: 'student', planFeatures });
      }

      case 'organization': {
        console.log('Deserializing organization...');
        user = await Organization.findById(object.id).lean();
        if (!user) {
          console.error('Organization not found for ID:', object.id);
          return done(null, false);
        }
        console.log('Organization found:', user);

        // Fetch plan features and metadata
        planFeatures = await getPlanFeaturesMap(user.planPurchased);
        metaData = await user.getFullMetadata();

        return done(null, { ...user, role: 'organization', planFeatures, metaData });
      }

      case 'user':
      default: {
        console.log('Deserializing user...');
        user = await User.findById(object.id).populate('organizationId', 'planPurchased').lean();
        if (!user) {
          console.error('User not found for ID:', object.id);
          return done(null, false);
        }
        console.log('User found:', user);

        if (user.organizationId) {
          planFeatures = await getPlanFeaturesMap(user.organizationId.planPurchased);
        }

        return done(null, { ...user, role: 'user', planFeatures });
      }
    }
  } catch (error) {
    console.error('Deserialization Error:', error);
    return done(error);
  } finally {
    console.log('=== DESERIALIZATION END ===');
  }
});

export default passport;
