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
  const [brackets, setBrackets] = useState([]);
  const [units, setUnits] = useState([]);

  // Check current session
  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
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
    getBrackets();
    getUnits();

    // Subscribe to auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
        // Fetch initial data when user logs in
        getBrackets();
        getUnits();
      } else {
        setUser(null);
        setIsLoggedIn(false);
        // Clear data on logout
        setBrackets([]);
        setUnits([]);
        navigate("/signup");
      }
    });

    // Subscribe to real-time changes in brackets
    const bracketsSubscription = supabase
      .channel("brackets_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bracket",
        },
        (payload) => {
          // Update brackets state based on the change
          if (payload.eventType === "INSERT") {
            setBrackets((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setBrackets((prev) =>
              prev.filter((bracket) => bracket.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setBrackets((prev) =>
              prev.map((bracket) =>
                bracket.id === payload.new.id ? payload.new : bracket
              )
            );
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes in units
    const unitsSubscription = supabase
      .channel("units_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "unit",
        },
        (payload) => {
          // Update units state based on the change
          if (payload.eventType === "INSERT") {
            setUnits((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setUnits((prev) =>
              prev.filter((unit) => unit.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setUnits((prev) =>
              prev.map((unit) =>
                unit.id === payload.new.id ? payload.new : unit
              )
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      if (authSubscription) authSubscription.unsubscribe();
      if (bracketsSubscription) bracketsSubscription.unsubscribe();
      if (unitsSubscription) unitsSubscription.unsubscribe();
    };
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
    const { error } = supabase.auth.signOut();

    if (error) throw new Error(error);

    setIsLoggedIn(false);
    navigate("/signup");
  }

  const [isLoading, setIsLoading] = useState({
    brackets: false,
    units: false,
  });

  async function getBrackets() {
    try {
      setIsLoading((prev) => ({ ...prev, brackets: true }));
      const { data, error } = await supabase
        .from("bracket")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBrackets(data);
      return data;
    } catch (error) {
      console.error("Error fetching brackets:", error.message);
      setErrors((prev) => [...prev, error]);
    } finally {
      setIsLoading((prev) => ({ ...prev, brackets: false }));
    }
  }

  async function getUnits() {
    try {
      setIsLoading((prev) => ({ ...prev, units: true }));
      const { data, error } = await supabase
        .from("unit")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUnits(data);
      return data;
    } catch (error) {
      console.error("Error fetching units:", error.message);
      setErrors((prev) => [...prev, error]);
    } finally {
      setIsLoading((prev) => ({ ...prev, units: false }));
    }
  }

  // Function to create a new bracket
  async function createBracket(bracketData) {
    try {
      setIsLoading((prev) => ({ ...prev, brackets: true }));
      const { data, error } = await supabase
        .from("bracket")
        .insert([{ ...bracketData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      setBrackets((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error creating bracket:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, brackets: false }));
    }
  }

  // Function to update a bracket
  async function updateBracket(id, updates) {
    try {
      setIsLoading((prev) => ({ ...prev, brackets: true }));
      const { data, error } = await supabase
        .from("bracket")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setBrackets((prev) =>
        prev.map((bracket) => (bracket.id === id ? data : bracket))
      );
      return data;
    } catch (error) {
      console.error("Error updating bracket:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, brackets: false }));
    }
  }

  // Function to delete a bracket
  async function deleteBracket(id) {
    try {
      setIsLoading((prev) => ({ ...prev, brackets: true }));
      const { error } = await supabase.from("bracket").delete().eq("id", id);

      if (error) throw error;

      setBrackets((prev) => prev.filter((bracket) => bracket.id !== id));
    } catch (error) {
      console.error("Error deleting bracket:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, brackets: false }));
    }
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
        signOut,
        supabase,
        // Data and loading states
        brackets,
        setBrackets,
        units,
        isLoading,
        // Data manipulation functions
        getBrackets,
        getUnits,
        createBracket,
        updateBracket,
        deleteBracket,
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
