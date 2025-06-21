// import passport from 'passport';
// import local from 'passport-local';
// import User from '../../models/FirstDB/user.model.js';
// import Student from '../../models/FirstDB/student.model.js';
// import {Organization} from '../../models/FirstDB/organization.model.js';
// import { getPlanFeaturesMap } from '../accessCheckerForPlan/getPlanFeature.js';
// import { getTotalBatches } from '../../controllers/SupabaseDB/batch.controllers.js';

// const LocalStrategy = local.Strategy; 

// passport.use('user-local',
//     new LocalStrategy({
//         usernameField: 'email',
//         passwordField: 'password',
//     },
//     async (email, password, done) => {
//         try {
//             const user = await User.findOne({ email: email}).select('+password');
//             if (!user) {
//                 return done(null, false, { message: 'User not found.' });
//             }
//             const isMatch = await user.comparePassword(password);
//             if (!isMatch) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }   
//             // return done(null, {...user.toObject(), role: user.roleId });
//             return done(null, { ...user.toObject(), role: 'user' });


//         } catch (error) {
//             return done(error);
//         }
//     }
// ));

// passport.use('student-local',
//     new LocalStrategy({
//         usernameField: 'email'
//     },
//     async (email, password, done) => {
//         try {
//             const student = await Student.findOne({ email: email}).select('+password').populate('organizationId', 'planPurchased');
//             if (!student) {
//                 return done(null, false, { message: 'Student not found.' });
//             }
//             const isMatch = await student.comparePassword(password);
//             if (!isMatch) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }  
//             const planFeatures = student.organizationId ? await getPlanFeaturesMap(student.organizationId.planPurchased) : null;     
//             return done(null, {...student.toObject(), role: 'student' , planFeatures : planFeatures });

//         } catch (error) {
//             return done(error);
//         }
//     }
// ));

// passport.use('org-local',
//     new LocalStrategy({
//         usernameField: 'email'
//     },
//     async (email, password, done) => {
//         try {
//             const org = await Organization.findOne({ email: email}).select('+password');
//             if (!org) {
//                 return done(null, false, { message: 'Organization not found.' });
//             }   
//             const isMatch = await org.comparePassword(password);
//             if (!isMatch) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }

//             return done(null, {...org.toObject(), role: 'organization' });
//         } catch (error) {
//             return done(error);
//         }       
//     }
// ));

// passport.use('institute-local',
//   new LocalStrategy(
//     { usernameField: 'email', passwordField: 'password' },
//     async (email, password, done) => {
//       try {
//         // First, try logging in as an Organization
//         const org = await Organization.findOne({ email })
//         .select('+password planPurchased')

//         if (org) {
//           const isMatch = await org.comparePassword(password);
//           if (!isMatch) {
//             return done(null, false, { message: 'Incorrect password.' });
//           }

//           const planFeatures = await getPlanFeaturesMap(org.planPurchased);
// const metaData = await org.getFullMetadata();

//           return done(null, {
//             ...org.toObject(),
//             role: 'organization',
//             planFeatures,
//             metaData
//           });
//         }

//         // Then, try logging in as a User
//         const user = await User.findOne({ email }).select('+password').populate('organizationId', 'planPurchased');
//         if (user) {
//           const isMatch = await user.comparePassword(password);
//           if (!isMatch) {
//             return done(null, false, { message: 'Incorrect password.' });
//           }

//           const planId = user.organizationId?.planPurchased || null;
//           const planFeatures = planId ? await getPlanFeaturesMap(planId) : {};
          
//           return done(null, {
//             ...user.toObject(),
//             role: 'user',
//             planFeatures
//           });
//         }

//         // No matching user/org found
//         return done(null, false, { message: 'No user or organization found with this email.' });

//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//     // done(null,{id:user._id,role:user.roleId} );
//     done(null, { id: user._id, role: user.role });
  
// });
// passport.deserializeUser(async (object, done) => {
//     try {
//         if(object.role === 'student') {
//             const student = await Student.findById(object.id).populate('organizationId', 'planPurchased');
//             if (!student) {
//                 return done(null, false, { message: 'Student not found.' });
//             }
//             const planFeatures = student.organizationId ? await getPlanFeaturesMap(student.organizationId.planPurchased) : null;
//             done(null, student?{...student.toObject(), role: 'student',planFeatures:planFeatures} : false);
//         }
//         else if(object.role === 'organization') {
//             const org = await Organization.findById(object.id)

//             if (!org) {
//                 return done(null, false, { message: 'Organization not found.' });
//             }
//             const planFeatures = await getPlanFeaturesMap(org.planPurchased) ;

//             const metaData=await org.getFullMetadata();

//             done(null, org ?{...org.toObject(), role: 'organization',planFeatures:planFeatures,metaData:metaData} : false);
//         }
//         else {
//             const user = await User.findById(object.id).populate('organizationId', 'planPurchased');
//             if (!user) {
//                 return done(null, false, { message: 'User not found.' });
//             }
//             const planFeatures = user.organizationId ? await getPlanFeaturesMap(user.organizationId.planPurchased) : null;
//             done(null, user?{...user.toObject(), role: 'user',planFeatures:planFeatures} : false);
//         }

//     } catch (error) {
//         done(error);
//     }
// });

// export default passport;


import passport from 'passport';
import local from 'passport-local';
import User from '../../models/FirstDB/user.model.js';
import Student from '../../models/FirstDB/student.model.js';
import {Organization} from '../../models/FirstDB/organization.model.js';
import { getPlanFeaturesMap } from '../accessCheckerForPlan/getPlanFeature.js';

const LocalStrategy = local.Strategy; 

// Your existing strategies remain the same...
passport.use('user-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email}).select('+password');
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

passport.use('student-local', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const student = await Student.findOne({ email: email}).select('+password').populate('organizationId', 'planPurchased');
        if (!student) {
            return done(null, false, { message: 'Student not found.' });
        }
        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }  
        const planFeatures = student.organizationId ? await getPlanFeaturesMap(student.organizationId.planPurchased) : null;     
        return done(null, {...student.toObject(), role: 'student' , planFeatures : planFeatures });
    } catch (error) {
        return done(error);
    }
}));

passport.use('org-local', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
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
}));

passport.use('institute-local', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const org = await Organization.findOne({ email })
        .select('+password planPurchased')

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
          const planFeatures = planId ? await getPlanFeaturesMap(planId) : {};
          
          return done(null, {
            ...user.toObject(),
            role: 'user',
            planFeatures
          });
        }

        return done(null, false, { message: 'No user or organization found with this email.' });
      } catch (err) {
        return done(err);
      }
    }
));

// FIX 1: Enhanced serializeUser with logging
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id, 'Role:', user.role);
    done(null, { id: user._id, role: user.role });
});

// FIX 2: Enhanced deserializeUser with better error handling
passport.deserializeUser(async (object, done) => {
    try {
        console.log('Deserializing user:', object);
        
        if (!object || !object.id || !object.role) {
            console.log('Invalid session object:', object);
            return done(null, false);
        }

        let user = null;
        let planFeatures = null;
        let metaData = null;

        switch (object.role) {
            case 'student': {
                user = await Student.findById(object.id).populate('organizationId', 'planPurchased');
                if (!user) {
                    console.log('Student not found for ID:', object.id);
                    return done(null, false);
                }
                planFeatures = user.organizationId ? await getPlanFeaturesMap(user.organizationId.planPurchased) : {};
                return done(null, { ...user.toObject(), role: 'student', planFeatures });
            }
            
            case 'organization': {
                user = await Organization.findById(object.id);
                if (!user) {
                    console.log('Organization not found for ID:', object.id);
                    return done(null, false);
                }
                
                // FIX 3: Add error handling for async operations
                try {
                    planFeatures = await getPlanFeaturesMap(user.planPurchased);
                    metaData = await user.getFullMetadata();
                } catch (asyncError) {
                    console.error('Error getting plan features or metadata:', asyncError);
                    // Continue without failing - provide defaults
                    planFeatures = {};
                    metaData = {};
                }
                
                return done(null, { 
                    ...user.toObject(), 
                    role: 'organization', 
                    planFeatures, 
                    metaData 
                });
            }
            
            case 'user': 
            default: {
                user = await User.findById(object.id).populate('organizationId', 'planPurchased');
                if (!user) {
                    console.log('User not found for ID:', object.id);
                    return done(null, false);
                }
                planFeatures = user.organizationId ? await getPlanFeaturesMap(user.organizationId.planPurchased) : {};
                return done(null, { ...user.toObject(), role: 'user', planFeatures });
            }
        }

    } catch (error) {
        console.error('Deserialization error:', error);
        // FIX 4: Don't fail authentication on deserialization errors
        // Instead, log the error and return false to force re-authentication
        return done(null, false);
    }
});

export default passport;