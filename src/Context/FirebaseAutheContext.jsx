import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.init';
import { AuthContext } from './AuthContext';

// 👇 change this to match your backend API base URL
const BACKEND_URL = "http://localhost:5000";

const googleProvider = new GoogleAuthProvider();

const FirebaseAutheContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create user
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Google sign in
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Log in user
    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Log out user
    const SignOutUser = () => {
        setLoading(true);
        setRole(null);
        return signOut(auth);
    };

    // Save or update user in backend without overwriting role
    const saveUserToBackend = async (currentUser) => {
        const { displayName, email, photoURL } = currentUser;
        try {
            await fetch(`${BACKEND_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: displayName, email, photoURL }) // no role sent
            });
            console.log("✅ User saved to backend:", email);
        } catch (err) {
            console.error('❌ Error saving user to backend:', err);
        }
    };

    // Fetch user role from backend
    const fetchUserRole = async (email) => {
        try {
            const res = await fetch(`${BACKEND_URL}/users/${email}`);
            const data = await res.json();
            console.log("🔑 Backend role response:", data);

            if (data?.success && data?.user?.role) {
                setRole(data.user.role);   // ✅ admin or user
                console.log("✅ Role set to:", data.user.role);
            } else {
                setRole('user'); // fallback
                console.warn("⚠️ No role found in DB. Defaulting to 'user'");
            }
        } catch (err) {
            console.error('❌ Error fetching user role:', err);
            setRole('user');
        }
    };

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                await saveUserToBackend(currentUser);
                await fetchUserRole(currentUser.email);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        role,
        loading,
        createUser,
        googleSignIn,
        logInUser,
        SignOutUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default FirebaseAutheContext;
