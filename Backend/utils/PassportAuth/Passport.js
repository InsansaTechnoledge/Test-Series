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

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id, 'Role:', user.role); // Log serialization
    done(null, { id: user._id, role: user.role });
});


passport.deserializeUser(async (object, done) => {
    try {
        console.log('=== DESERIALIZATION START ===');
        console.log('Session object received:', JSON.stringify(object));
        console.log('Environment:', process.env.NODE_ENV);
        
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
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(object.id)) {
            console.error('Invalid ObjectId format:', object.id);
            return done(null, false);
        }

        let user = null;
        let planFeatures = {};
        let metaData = {};

        console.log(`Attempting to deserialize ${object.role} with ID: ${object.id}`);

        switch (object.role) {
            case 'student': {
                console.log('Deserializing student...');
                try {
                    user = await Student.findById(object.id)
                        .populate('organizationId', 'planPurchased')
                        .lean(); // Use lean() for better performance
                    
                    if (!user) {
                        console.error('Student not found for ID:', object.id);
                        return done(null, false);
                    }
                    
                    console.log('Student found:', {
                        id: user._id,
                        email: user.email,
                        hasOrganization: !!user.organizationId
                    });
                    
                    if (user.organizationId && user.organizationId.planPurchased) {
                        try {
                            planFeatures = await getPlanFeaturesMap(user.organizationId.planPurchased);
                        } catch (planError) {
                            console.error('Error getting plan features for student:', planError);
                            planFeatures = {};
                        }
                    }
                    
                    return done(null, { 
                        ...user, 
                        role: 'student', 
                        planFeatures 
                    });
                    
                } catch (studentError) {
                    console.error('Error finding student:', studentError);
                    return done(null, false);
                }
            }
            
            case 'organization': {
                console.log('Deserializing organization...');
                try {
                    user = await Organization.findById(object.id).lean();
                    
                    if (!user) {
                        console.error('Organization not found for ID:', object.id);
                        return done(null, false);
                    }
                    
                    console.log('Organization found:', {
                        id: user._id,
                        email: user.email,
                        planPurchased: user.planPurchased
                    });
                    
                    // Fetch plan features
                    if (user.planPurchased) {
                        try {
                            planFeatures = await getPlanFeaturesMap(user.planPurchased);
                        } catch (planError) {
                            console.error('Error getting plan features for organization:', planError);
                            planFeatures = {};
                        }
                    }
                    
                    // Fetch metadata - need to get the full document for methods
                    try {
                        const fullOrgDoc = await Organization.findById(object.id);
                        if (fullOrgDoc && typeof fullOrgDoc.getFullMetadata === 'function') {
                            metaData = await fullOrgDoc.getFullMetadata();
                        }
                    } catch (metaError) {
                        console.error('Error getting metadata for organization:', metaError);
                        metaData = {};
                    }
                    
                    return done(null, { 
                        ...user, 
                        role: 'organization', 
                        planFeatures, 
                        metaData 
                    });
                    
                } catch (orgError) {
                    console.error('Error finding organization:', orgError);
                    return done(null, false);
                }
            }
            
            case 'user':
            default: {
                console.log('Deserializing user...');
                try {
                    user = await User.findById(object.id)
                        .populate('organizationId', 'planPurchased')
                        .lean();
                    
                    if (!user) {
                        console.error('User not found for ID:', object.id);
                        return done(null, false);
                    }
                    
                    console.log('User found:', {
                        id: user._id,
                        email: user.email,
                        hasOrganization: !!user.organizationId
                    });
                    
                    if (user.organizationId && user.organizationId.planPurchased) {
                        try {
                            planFeatures = await getPlanFeaturesMap(user.organizationId.planPurchased);
                        } catch (planError) {
                            console.error('Error getting plan features for user:', planError);
                            planFeatures = {};
                        }
                    }
                    
                    return done(null, { 
                        ...user, 
                        role: 'user', 
                        planFeatures 
                    });
                    
                } catch (userError) {
                    console.error('Error finding user:', userError);
                    return done(null, false);
                }
            }
        }
    } catch (error) {
        console.error('=== DESERIALIZATION ERROR ===');
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Check for specific database connection issues
        if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
            console.error('Database connection issue detected');
        }
        
        return done(error);
    } finally {
        console.log('=== DESERIALIZATION END ===');
    }
});



export default passport;