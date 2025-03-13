import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getAccountModel, IAccountDocument } from '../models/Account';

// Serialización del usuario para la sesión
passport.serializeUser((user: any, done) => {
    done(null, user.accountId || user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const Account = getAccountModel();
        const user = await Account.findById(id).select('-password');
        if (!user) {
            return done(null, false);
        }
        
        const bodyAccount = {
            accountId: user._id,
            name: user.name,
            nameSanitized: user.nameSanitized,
            email: user.email
        };
        
        done(null, bodyAccount);
    } catch (error) {
        done(error);
    }
});

passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
}, async (name, password, done) => {
    try {
        const Account = getAccountModel();
        const user = await Account.findOne({ nameSanitized: name.toLowerCase() });
        
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        const bodyAccount = {
            accountId: user._id,
            name: user.name,
            nameSanitized: user.nameSanitized,
            email: user.email
        };

        return done(null, bodyAccount);
    } catch (error) {
        return done(error);
    }
}));

export default passport; 