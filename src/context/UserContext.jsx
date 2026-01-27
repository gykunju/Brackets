import { useContext, createContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import { parseDocument } from "../services/documentParser";
import { extractTextFromVisualPDF } from "../services/aiService";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const userContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [brackets, setBrackets] = useState(() => {
    // Initialize brackets from localStorage if available
    const savedBrackets = localStorage.getItem("user_brackets");
    return savedBrackets ? JSON.parse(savedBrackets) : [];
  });
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("user_events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
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
    content: false,
  });

  useEffect(() => {
    let authSubscription = null;
    let bracketsSubscription = null;
    let unitsSubscription = null;
    let eventsSubscription = null;

    // Initialize session and load data
    const initializeApp = async () => {
      try {
        // First, check if there's an existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }

        if (session) {
          setUser(session.user);
          setIsLoggedIn(true);
          // Fetch profile first, then fetch all other data in parallel
          try {
            const profileData = await getProfile();
            if (profileData?.id) {
              await Promise.all([
                getBrackets(profileData.id),
                getUnits(),
                getEvents(profileData.id),
                getAllContent(profileData.id)
              ]);
            }
          } catch (fetchError) {
            console.error("Error fetching initial data:", fetchError);
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setAuthLoading(false);
      }

      // Set up listener for future auth state changes (sign in, sign out, etc.)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setIsLoggedIn(true);
          try {
            const profileData = await getProfile();
            if (profileData?.id) {
              await Promise.all([
                getBrackets(profileData.id),
                getUnits(),
                getEvents(profileData.id),
                getAllContent(profileData.id)
              ]);
            }
          } catch (fetchError) {
            console.error("Error fetching data after sign in:", fetchError);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsLoggedIn(false);
          setBrackets([]);
          setUnits([]);
          setEvents([]);
          setContent([]);
          localStorage.clear();
        }
      });
      authSubscription = subscription;
    };

    initializeApp();

    // Subscribe to real-time changes in brackets
    bracketsSubscription = supabase
      .channel("brackets_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bracket",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBrackets((prev) => [payload.new, ...prev]);
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
    unitsSubscription = supabase
      .channel("units_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "unit",
        },
        (payload) => {
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
    eventsSubscription = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event",
        },
        (payload) => {
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

    // Cleanup all subscriptions on unmount
    return () => {
      if (authSubscription) authSubscription.unsubscribe();
      if (bracketsSubscription) bracketsSubscription.unsubscribe();
      if (unitsSubscription) unitsSubscription.unsubscribe();
      if (eventsSubscription) eventsSubscription.unsubscribe();
    };
  }, []);

  // Consolidated debounced localStorage persistence - prevents excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (profile) {
        localStorage.setItem("user_profile", JSON.stringify(profile));
      } else {
        localStorage.removeItem("user_profile");
      }
      if (brackets && brackets.length >= 0) {
        localStorage.setItem("user_brackets", JSON.stringify(brackets));
      }
      if (events && events.length >= 0) {
        localStorage.setItem("user_events", JSON.stringify(events));
      }
      if (units && units.length >= 0) {
        localStorage.setItem("user_units", JSON.stringify(units));
      }
      if (content && content.length >= 0) {
        localStorage.setItem("user_content", JSON.stringify(content));
      }
    }, 500); // Debounce by 500ms to batch rapid state updates

    return () => clearTimeout(timeoutId);
  }, [profile, brackets, events, units, content]);

  async function updateProfile(updates) {
    try {
      setIsLoading((prev) => ({ ...prev, profile: true }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("profile")
        .update(updates)
        .eq("supabase_user_id", session.user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors((prev) => [...prev, error]);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, profile: false }));
    }
  }

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

      await getProfile();
      navigate("/");
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

  function signOut() {
    try {
      const { error } = supabase.auth.signOut();

      if (error) throw error;

      // Clear all user data including localStorage
      setUser(null);
      setProfile(null);
      setBrackets([]);
      setUnits([]);
      setEvents([]);
      setContent([]);
      setIsLoggedIn(false);
      localStorage.clear();

      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  async function getBrackets(profileId = null) {
    try {
      let targetProfileId = profileId;

      if (!targetProfileId) {
        // Fallback: Checks session if no ID passed
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data: profile } = await supabase
          .from("profile")
          .select("id")
          .eq("supabase_user_id", session.user.id)
          .single();
          
        if (profile) targetProfileId = profile.id;
      }

      if (!targetProfileId) return;

      setIsLoading((prev) => ({ ...prev, brackets: true }));

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

  // Create bracket
  async function createBracket(bracketData) {
    try {
      let targetProfileId = profile?.id;

      if (!targetProfileId) {
        // Fallback fetch
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
             const { data: p } = await supabase.from("profile").select("id").eq("supabase_user_id", session.user.id).single();
             if (p) targetProfileId = p.id;
        }
      }

      if (!targetProfileId) throw new Error("No profile found - try refreshing");

      setIsLoading((prev) => ({ ...prev, brackets: true }));
      
      const newBracket = { ...bracketData, user_id: targetProfileId };

      const { data, error } = await supabase
        .from("bracket")
        .insert(newBracket)
        .select()
        .single();
  
      if (error) throw error;

      setBrackets((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error creating bracket:", error);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, brackets: false }));
    }
  }

  // Update bracket
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
      
      setBrackets((prev) => prev.map((b) => (b.id === id ? data : b)));
      return data;
    } catch (error) {
      console.error("Error updating bracket:", error);
      throw error;
    } finally {
      setIsLoading((prev) => ({ ...prev, brackets: false }));
    }
  }

  // Delete bracket
  async function deleteBracket(id) {
    try {
      setIsLoading((prev) => ({ ...prev, brackets: true }));
      const { error } = await supabase.from("bracket").delete().eq("id", id);
      
      if (error) throw error;
      
      setBrackets((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting bracket:", error);
      throw error;
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

      setUnits((prev) => prev.map((unit) => (unit.id === id ? data : unit)));
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
        if (!session?.user?.id) return;
        
        const { data: profile } = await supabase
          .from("profile")
          .select("id")
          .eq("supabase_user_id", session.user.id)
          .single();
          
        if (profile) targetProfileId = profile.id;
      }

      if (!targetProfileId) return;

      setIsLoading((prev) => ({ ...prev, events: true }));

      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("user_id", targetProfileId)
        .order("date", { ascending: true });

      if (error) throw error;

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
      let currentUserProfileId = profile?.id;
      
      if (!currentUserProfileId) {
         // Fallback fetch if state is stale
         const { data: { session } } = await supabase.auth.getSession();
         if (session?.user?.id) {
            const { data: p } = await supabase.from("profile").select("id").eq("supabase_user_id", session.user.id).single();
            if (p) currentUserProfileId = p.id;
         }
      }

      if (!currentUserProfileId) {
        throw new Error("No profile found - please try refreshing the page");
      }

      setIsLoading((prev) => ({ ...prev, events: true }));
      const eventToInsert = { ...eventData, user_id: currentUserProfileId };

      const { data, error } = await supabase
        .from("event")
        .insert([eventToInsert])
        .select()
        .single();

      if (error) throw error;

      setEvents((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
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
  async function getAllContent(profileId = null) {
    try {
      let targetProfileId = profileId;

      if (!targetProfileId) {
         if (profile?.id) {
            targetProfileId = profile.id;
         } else {
             const { data: { session } } = await supabase.auth.getSession();
             if (session?.user?.id) {
                const { data: p } = await supabase.from("profile").select("id").eq("supabase_user_id", session.user.id).single();
                if (p) targetProfileId = p.id;
             }
         }
      }

      if (!targetProfileId) return;

      setIsLoading((prev) => ({ ...prev, content: true }));
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("user_id", targetProfileId)
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
      let targetProfileId = profile?.id;
      
      if (!targetProfileId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
           const { data: p } = await supabase.from("profile").select("id").eq("supabase_user_id", session.user.id).single();
           if (p) targetProfileId = p.id;
        }
      }

      if (!targetProfileId) {
        throw new Error("No profile found - please refresh the page");
      }

      setIsLoading((prev) => ({ ...prev, content: true }));

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.ms-powerpoint", // .ppt
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only PDFs, Word documents, PowerPoint presentations, and images are allowed."
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error("File size exceeds 10MB limit.");
      }

      // Get current user ID for storage path (must use auth user ID for RLS policies)
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Create unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${unitId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("content-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("content-files").getPublicUrl(filePath);

      // Determine file type
      let fileType = "pdf"; // default
      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (
        file.type.includes("wordprocessingml") ||
        file.type.includes("msword")
      ) {
        fileType = "word";
      } else if (
        file.type.includes("presentationml") ||
        file.type.includes("ms-powerpoint")
      ) {
        fileType = "powerpoint";
      }

      // Extract text from document (for Word, PowerPoint, and PDF)
      let extractedText = null;
      if (
        fileType === "word" ||
        fileType === "powerpoint" ||
        fileType === "pdf"
      ) {
        try {
          console.log(`Extracting text from ${fileType} file...`);
          extractedText = await parseDocument(file, fileType);
          
          // Fallback to Visual OCR if text is too short (likely scanned or slides)
          if (!extractedText || extractedText.length < 200) {
             console.log("Text extraction yielded low content (likely images/slides). Attempting Visual OCR...");
             const ocrText = await extractTextFromVisualPDF(file);
             if (ocrText && ocrText.length > extractedText.length) {
                console.log("Visual OCR successful. replaced text.");
                extractedText = `[Visual OCR Result]\n${ocrText}`;
             }
          }

          console.log("DEBUG: Extracted text type:", typeof extractedText);
          console.log("DEBUG: Extracted text preview:", extractedText ? extractedText.substring(0, 100) : "N/A");
          console.log(`Extracted text length: ${extractedText?.length || 0} characters`);
        } catch (error) {
          console.error("Error extracting text:", error);
          // Continue with upload even if text extraction fails
        }
      }

      // Create content record in database
      const { data: contentData, error: contentError } = await supabase
        .from("content")
        .insert([
          {
            title,
            description,
            file_url: publicUrl,
            file_name: file.name,
            file_type: fileType,
            file_size: file.size,
            mime_type: file.type,
            unit_id: unitId,
            user_id: targetProfileId,
            extracted_text: extractedText,
          },
        ])
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
      const pathParts = filePath.split("/content-files/");
      const storagePath = pathParts[pathParts.length - 1];

      const { error: storageError } = await supabase.storage
        .from("content-files")
        .remove([storagePath]);

      if (storageError)
        console.error("Error deleting file from storage:", storageError);

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



  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoggedIn,
    setIsLoggedIn,
    signIn,
    signUp,
    errors,
    signOut,
    supabase,
    authLoading,
    // Data and loading states
    brackets,
    setBrackets,
    units,
    events,
    setEvents,
    content,
    setContent,
    isLoading,
    setIsLoading,
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
    updateProfile,
  }), [
    user, isLoggedIn, errors, authLoading,
    brackets, units, events, content, isLoading, profile
  ]);

  return (
    <userContext.Provider value={contextValue}>
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
