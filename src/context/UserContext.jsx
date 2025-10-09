import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const userContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate("/");

  const [errors, setErrors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

 
  
  // Check current session
  const checkSession = async () => {
    try {
      const {data: { session }, error} = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setIsLoggedIn(false);
      navigate("/signup");
    }
  };

  useEffect(() => {

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        navigate("/signup");
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
    console.log(isLoggedIn);
  }, []);

   async function signIn(formData) {
     const { data, error } = await supabase.auth.signInWithPassword(formData);
     if (data && !error) {
       setUser(data.user);
       setIsLoggedIn(true);
       navigate("/");
     } else {
       setErrors((prev) => [...prev, error]);
       throw new Error(error);
     }
   }

  async function signUp(formData) {
    const { data, error } = await supabase.auth.signUp(formData);
    console.log(data);
    if (data && !error) {
      const profileData = {
        full_name:
          data.user.user_metadata.first_name +
          " " +
          data.user.user_metadata.last_name,
        brackets: 0,
        courses: 0,
        email: data.user.email,
        supabase_user_id: data.id,
      };

      const { error: insertError } = await supabase
        .from("profile")
        .insert(profileData);
      if (insertError) throw new Error(insertError);

      setIsLoggedIn(true);
      navigate("/");
    } else {
      setErrors((prev) => [...prev, error]);
      throw new Error(error);
    }
  }

  async function signOut() {
    const { error } = supabase.auth.signOut()

    if (error) throw new Error(error)

    setIsLoggedIn(false)
    navigate('/signup')
  }

  return (
    <userContext.Provider
      value={{
        user,
        isLoggedIn,
        setIsLoggedIn,
        signIn,
        signUp,
        errors,
        checkSession,
        signOut 
      }}
    >
      {children}
    </userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useUser must be used within UseProvider");
  }

  return context;
}
