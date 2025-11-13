import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import { parseDocument } from "../services/documentParser";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const userContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [brackets, setBrackets] = useState(() => {
    // Initialize brackets from localStorage if available
    const savedBrackets = localStorage.getItem("user_brackets");
    return savedBrackets ? JSON.parse(savedBrackets) : [];
  });
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("user_events")
    return savedEvents ? JSON.parse(savedEvents) : [];
  })
  const [units, setUnits] = useState(() => {
    const savedUnits = localStorage.getItem("user_units");
    return savedUnits ? JSON.parse(savedUnits) : [];
  });
  const [profile, setProfile] = useState(() => {
    // Initialize profile from localStorage if available
    const savedProfile = localStorage.getItem("user_profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [content, setContent] = useState(() => {
    const savedContent = localStorage.getItem("user_content");
    return savedContent ? JSON.parse(savedContent) : [];
  });

  const [isLoading, setIsLoading] = useState({
    brackets: false,
    units: false,
    events: false,
    content: false
  });

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

        // Fetch profile when session is restored
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profile")
            .select("*")
            .eq("supabase_user_id", session.user.id)
            .single();

          if (!profileError && profileData) {
            setProfile(profileData);
          }
        } catch (profileErr) {
          console.error("Error fetching profile in checkSession:", profileErr);
        }
      } else {
        setUser(null);
        setProfile(null);
        setIsLoggedIn(false);
        // Don't navigate here - let the routing handle it
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setIsLoggedIn(false);
      // Don't navigate here - let the routing handle it
    }
  };

  useEffect(() => {
    // Initialize session and load data
    const initializeApp = async () => {
      await checkSession();
      // Data will be loaded via auth state change or when profile is set
    };

    initializeApp();

    // Subscribe to auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
        // Fetch all necessary data when user logs in
        await getProfile(); // Get profile first
        await getBrackets();
        await getUnits();
        await getEvents();
        await getAllContent(); // Fetch all content for AI assistant
      } else {
        setUser(null);
        setProfile(null);
        setIsLoggedIn(false);
        // Clear data on logout
        setBrackets([]);
        setUnits([]);
        setEvents([]);
        setContent([]);
        // Don't force navigate - let routing handle it
      }
    });

    // Subscribe to real-time changes in brackets
    // Note: Filter is not applied here because profile may not be loaded yet
    // Filtering happens in the callback instead
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
            setBrackets((prev) => [payload.new, ...prev]); // Add new brackets at the start
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

    // Subscribe to real-time changes in events
    const eventsSubscription = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event",
        },
        (payload) => {
          // Update events state based on the change
          if (payload.eventType === "INSERT") {
            setEvents((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setEvents((prev) =>
              prev.filter((event) => event.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === payload.new.id ? payload.new : event
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
      if (eventsSubscription) eventsSubscription.unsubscribe();
    };
  }, []);

  // Persist profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user_profile");
    }
  }, [profile]);

  // Persist brackets to localStorage whenever they change
  useEffect(() => {
    if (brackets && brackets.length >= 0) {
      localStorage.setItem("user_brackets", JSON.stringify(brackets));
    }
  }, [brackets]);

  useEffect(() => {
    if (events && events.length >= 0) {
      localStorage.setItem('user_events', JSON.stringify(events))
    }
  }, [events])

  useEffect(() => {
    if (units && units.length >= 0) {
      localStorage.setItem('user_units', JSON.stringify(units))
    }
  }, [units])

  useEffect(() => {
    if (content && content.length >= 0) {
      localStorage.setItem('user_content', JSON.stringify(content))
    }
  }, [content])

  // Load brackets, units, and content when profile is available
  useEffect(() => {
    if (profile?.id) {
      getBrackets(profile.id);
      getUnits();
      getAllContent();
    }
  }, [profile?.id]);

  async function getProfile() {
    try {
      // First ensure we have a user
      let currentUser = user;

      if (!currentUser) {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session?.user) {
          throw new Error("No authenticated user found");
        }

        currentUser = session.user;
        setUser(currentUser);
      }

      // Get profile with the user ID
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("supabase_user_id", currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Profile data:", data); // Debug log
      setProfile(data);
      return data;
    } catch (error) {
      console.error("Error in getProfile:", error);
      setProfile(null);
      throw error;
    }
  }

  async function signIn(formData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(formData);
      if (error) throw error;

      setUser(data.user);
      setIsLoggedIn(true);

      navigate("/");
      // Get user profile after successful sign in
      await getProfile();
    } catch (error) {
      setErrors((prev) => [...prev, error]);
      throw error;
    }
  }

  async function signUp(formData) {
    try {
      const { data, error } = await supabase.auth.signUp(formData);

      if (error) {
        console.error("SignUp error:", error);
        setErrors((prev) => [...prev, error]);
        throw error;
      }

      // supabase v2 returns the created user under data.user
      const createdUser = data?.user;

      if (!createdUser) {
        // In some flows (email confirmation required) Supabase may not return a user object.
        console.warn(
          "signUp: no user returned from supabase.auth.signUp — email confirmation required"
        );
        navigate("/");
        return null;
      }

      // Persist user in local state
      setUser(createdUser);
      setIsLoggedIn(true);

      // Profile will be created automatically by database trigger
      // The auth state change listener will fetch the profile
      navigate("/");

      return createdUser;
    } catch (err) {
      setErrors((prev) => [...prev, err]);
      throw err;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // Clear all user data including localStorage
      setUser(null);
      setProfile(null);
      setBrackets([]);
      setUnits([]);
      setEvents([]);
      setContent([]);
      setIsLoggedIn(false);
      localStorage.removeItem("user_profile");
      localStorage.removeItem("user_brackets");
      localStorage.removeItem("user_units");
      localStorage.removeItem("user_events");
      localStorage.removeItem("user_content");

      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async function getBrackets(profileId = null) {
    try {
      // Use provided profileId or get from current user
      let targetProfileId = profileId;

      if (!targetProfileId) {
        // Get the current user's profile ID
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          console.log("No session found, skipping bracket fetch");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("id")
          .eq("supabase_user_id", session.user.id)
          .single();

        if (profileError || !profileData) {
          console.error("Error fetching profile for brackets:", profileError);
          return;
        }

        targetProfileId = profileData.id;
      }

      setIsLoading((prev) => ({ ...prev, brackets: true }));

      // Get brackets for the current profile using targetProfileId
      const { data, error } = await supabase
        .from("bracket")
        .select("*")
        .eq("user_id", targetProfileId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBrackets(data || []);
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

      setUnits(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching units:", error.message);
      setErrors((prev) => [...prev, error]);
    } finally {
      setIsLoading((prev) => ({ ...prev, units: false }));
    }
  }

  // Create unit
  async function createUnit(unitData) {
    try {
      setIsLoading((prev) => ({ ...prev, units: true }));
      const { data, error } = await supabase
        .from("unit")
        .insert([unitData])
        .select()
        .single();

      if (error) throw error;

      setUnits((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error creating unit:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, units: false }));
    }
  }

  // Update unit
  async function updateUnit(id, updates) {
    try {
      setIsLoading((prev) => ({ ...prev, units: true }));
      const { data, error } = await supabase
        .from("unit")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setUnits((prev) =>
        prev.map((unit) => (unit.id === id ? data : unit))
      );
      return data;
    } catch (error) {
      console.error("Error updating unit:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, units: false }));
    }
  }

  // Delete unit
  async function deleteUnit(id) {
    try {
      setIsLoading((prev) => ({ ...prev, units: true }));
      const { error } = await supabase.from("unit").delete().eq("id", id);

      if (error) throw error;

      setUnits((prev) => prev.filter((unit) => unit.id !== id));
    } catch (error) {
      console.error("Error deleting unit:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, units: false }));
    }
  }

  async function getEvents(profileId = null) {
    try {
      let targetProfileId = profileId;

      if (!targetProfileId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log("No session found, skipping event fetch");
          return;
        }
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('id')
          .eq("supabase_user_id", session.user.id)
          .single();

        if (profileError || !profileData) {
          console.error("Error fetching profile for Events:", profileError);
          return;
        }
        targetProfileId = profileData.id;
      }

      setIsLoading((prev) => ({ ...prev, events: true }));

      const { data, error } = await supabase
        .from('event')
        .select("*")
        .eq("user_id", targetProfileId)
        .order("date", { ascending: true });

      if (error) throw new Error(error.message);

      setEvents(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching events:", error.message);
      setErrors((prev) => [...prev, error]);
    } finally {
      setIsLoading((prev) => ({ ...prev, events: false }));
    }
  }

  // Create event
  async function createEvent(eventData) {
    try {
      console.log("Creating event with data:", eventData);

      if (!profile?.id) {
        console.log("Profile not found, fetching...");
        await getProfile();
        if (!profile?.id) {
          throw new Error("No profile found - please try logging out and back in");
        }
      }

      console.log("Profile ID:", profile.id);

      setIsLoading((prev) => ({ ...prev, events: true }));
      const eventToInsert = { ...eventData, user_id: profile.id };
      console.log("Inserting event:", eventToInsert);

      const { data, error } = await supabase
        .from("event")
        .insert([eventToInsert])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Event created successfully:", data);
      setEvents((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, events: false }));
    }
  }

  // Update event
  async function updateEvent(id, updates) {
    try {
      setIsLoading((prev) => ({ ...prev, events: true }));
      const { data, error } = await supabase
        .from("event")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setEvents((prev) =>
        prev.map((event) => (event.id === id ? data : event))
      );
      return data;
    } catch (error) {
      console.error("Error updating event:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, events: false }));
    }
  }

  // Delete event
  async function deleteEvent(id) {
    try {
      setIsLoading((prev) => ({ ...prev, events: true }));
      const { error } = await supabase.from("event").delete().eq("id", id);

      if (error) throw error;

      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, events: false }));
    }
  }

  // Get ALL content for the user
  async function getAllContent() {
    try {
      if (!profile?.id) {
        console.log("No profile found, skipping content fetch");
        return;
      }

      setIsLoading((prev) => ({ ...prev, content: true }));
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setContent(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching all content:", error.message);
      setErrors((prev) => [...prev, error]);
    } finally {
      setIsLoading((prev) => ({ ...prev, content: false }));
    }
  }

  // Get content for a specific unit
  async function getContent(unitId) {
    try {
      setIsLoading((prev) => ({ ...prev, content: true }));
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("unit_id", unitId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Don't override the global content state, just return the data
      return data;
    } catch (error) {
      console.error("Error fetching content:", error.message);
      setErrors((prev) => [...prev, error]);
    } finally {
      setIsLoading((prev) => ({ ...prev, content: false }));
    }
  }

  // Upload file to Supabase Storage and create content record
  async function uploadContent(file, unitId, title, description = "") {
    try {
      if (!profile?.id) {
        await getProfile();
        if (!profile?.id) {
          throw new Error("No profile found");
        }
      }

      setIsLoading((prev) => ({ ...prev, content: true }));

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/vnd.ms-powerpoint' // .ppt
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only PDFs, Word documents, PowerPoint presentations, and images are allowed.");
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error("File size exceeds 10MB limit.");
      }

      // Get current user ID for storage path (must use auth user ID for RLS policies)
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${unitId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-files')
        .getPublicUrl(filePath);

      // Determine file type
      let fileType = 'pdf'; // default
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.includes('wordprocessingml') || file.type.includes('msword')) {
        fileType = 'word';
      } else if (file.type.includes('presentationml') || file.type.includes('ms-powerpoint')) {
        fileType = 'powerpoint';
      }

      // Extract text from document (for Word, PowerPoint, and PDF)
      let extractedText = null;
      if (fileType === 'word' || fileType === 'powerpoint' || fileType === 'pdf') {
        try {
          console.log(`Extracting text from ${fileType} file...`);
          extractedText = await parseDocument(file, fileType);
          console.log(`Extracted text length: ${extractedText?.length || 0} characters`);
        } catch (error) {
          console.error('Error extracting text:', error);
          // Continue with upload even if text extraction fails
        }
      }

      // Create content record in database
      const { data: contentData, error: contentError } = await supabase
        .from("content")
        .insert([{
          title,
          description,
          file_url: publicUrl,
          file_name: file.name,
          file_type: fileType,
          file_size: file.size,
          mime_type: file.type,
          unit_id: unitId,
          user_id: profile.id,
          extracted_text: extractedText
        }])
        .select()
        .single();

      if (contentError) throw contentError;

      setContent((prev) => [contentData, ...prev]);
      return contentData;
    } catch (error) {
      console.error("Error uploading content:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, content: false }));
    }
  }

  // Delete content
  async function deleteContent(contentId, filePath) {
    try {
      setIsLoading((prev) => ({ ...prev, content: true }));

      // Delete file from storage
      const pathParts = filePath.split('/content-files/');
      const storagePath = pathParts[pathParts.length - 1];

      const { error: storageError } = await supabase.storage
        .from('content-files')
        .remove([storagePath]);

      if (storageError) console.error("Error deleting file from storage:", storageError);

      // Delete content record from database
      const { error: dbError } = await supabase
        .from("content")
        .delete()
        .eq("id", contentId);

      if (dbError) throw dbError;

      setContent((prev) => prev.filter((item) => item.id !== contentId));
    } catch (error) {
      console.error("Error deleting content:", error.message);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, content: false }));
    }
  }

  // Function to create a new bracket
  async function createBracket(bracketData) {
    try {
      // Ensure we have the profile
      if (!profile?.id) {
        await getProfile();
        if (!profile?.id) {
          throw new Error("No profile found");
        }
      }

      setIsLoading((prev) => ({ ...prev, brackets: true }));
      const { data, error } = await supabase
        .from("bracket")
        .insert([{ ...bracketData, user_id: profile.id }])
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
        events,
        setEvents,
        content,
        setContent,
        isLoading,
        // Bracket functions
        getBrackets,
        createBracket,
        updateBracket,
        deleteBracket,
        // Unit functions
        getUnits,
        createUnit,
        updateUnit,
        deleteUnit,
        setUnits,
        // Event functions
        getEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        // Content functions
        getContent,
        getAllContent,
        uploadContent,
        deleteContent,
        // Profile related
        profile,
        setProfile,
        getProfile,
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
