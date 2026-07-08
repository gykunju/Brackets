import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import { LuBookMinus, LuNotebookText } from "react-icons/lu";
import { FiFile, FiImage, FiCopy } from "react-icons/fi";
import { FaFilePowerpoint, FaFileWord } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-hot-toast";

function SharedBracket() {
  const { share_token } = useParams();
  const navigate = useNavigate();
  const { supabase, profile, isLoggedIn } = useUser();
  
  const [bracket, setBracket] = useState(null);
  const [units, setUnits] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSharedBracket() {
      try {
        setLoading(true);
        // 1. Fetch Bracket
        const { data: bracketData, error: bracketError } = await supabase
          .from("bracket")
          .select("*")
          .eq("share_token", share_token)
          .eq("is_public", true)
          .single();

        if (bracketError || !bracketData) {
          throw new Error("Bracket not found or is not public.");
        }
        setBracket(bracketData);

        // 2. Fetch Units
        const { data: unitsData, error: unitsError } = await supabase
          .from("unit")
          .select("*")
          .eq("bracket_id", bracketData.id);

        if (unitsError) throw unitsError;
        setUnits(unitsData || []);

        // 3. Fetch Content if there are units
        if (unitsData && unitsData.length > 0) {
          const unitIds = unitsData.map(u => u.id);
          const { data: contentData, error: contentError } = await supabase
            .from("content")
            .select("*")
            .in("unit_id", unitIds);
          
          if (contentError) throw contentError;
          setContent(contentData || []);
        }
      } catch (err) {
        console.error("Error loading shared bracket:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (share_token) {
      loadSharedBracket();
    }
  }, [share_token, supabase]);

  const handleClone = async () => {
    if (!isLoggedIn || !profile) {
      toast.error("Please sign in to clone this bracket.");
      navigate("/signin");
      return;
    }

    try {
      setCloning(true);
      
      // 1. Clone Bracket
      const { data: newBracket, error: bracketError } = await supabase
        .from("bracket")
        .insert({
          title: bracket.title + " (Clone)",
          current: false,
          user_id: profile.id,
          is_public: false
        })
        .select()
        .single();
        
      if (bracketError) throw bracketError;

      // 2. Clone Units and Content
      if (units.length > 0) {
        for (const oldUnit of units) {
          const { data: newUnit, error: unitError } = await supabase
            .from("unit")
            .insert({
              title: oldUnit.title,
              bracket_id: newBracket.id
            })
            .select()
            .single();
            
          if (unitError) throw unitError;

          // Clone Content for this unit
          const unitContent = content.filter(c => c.unit_id === oldUnit.id);
          if (unitContent.length > 0) {
            const newContentRows = unitContent.map(c => ({
              title: c.title,
              description: c.description,
              file_url: c.file_url,
              file_name: c.file_name,
              file_type: c.file_type,
              file_size: c.file_size,
              mime_type: c.mime_type,
              unit_id: newUnit.id,
              user_id: profile.id
            }));
            
            const { error: contentError } = await supabase
              .from("content")
              .insert(newContentRows);
              
            if (contentError) throw contentError;
          }
        }
      }

      toast.success("Bracket cloned successfully!");
      navigate(`/brackets/${encodeURIComponent(newBracket.title)}`);
    } catch (err) {
      console.error("Error cloning bracket:", err);
      toast.error("Failed to clone bracket. Please try again.");
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-lime-200 border-t-lime-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-center max-w-md mx-4">
          <h2 className="text-xl font-bold mb-2">Unavailable</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="geist-font min-h-screen bg-stone-50 dark:bg-stone-950 pb-20"
    >
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg">
            <IoMdArrowBack size={24} className="text-stone-700 dark:text-stone-300" />
          </button>
          <h1 className="font-bold text-lg text-stone-900 dark:text-white truncate mx-4">
            Shared Bracket: {bracket?.title}
          </h1>
          <button 
            onClick={handleClone}
            disabled={cloning}
            className="flex items-center gap-2 px-4 py-2 bg-lime-700 hover:bg-lime-800 text-white rounded-lg disabled:opacity-50 font-medium transition-colors"
          >
            <FiCopy /> {cloning ? "Cloning..." : "Clone to My Account"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-5 mt-6">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm mb-6 flex items-start gap-4">
          <div className="p-4 bg-lime-50 dark:bg-lime-900/20 rounded-xl text-lime-700 dark:text-lime-400">
            <LuBookMinus size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{bracket?.title}</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-1">
              Includes {units.length} units and {content.length} files.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Units Preview</h3>
        <div className="grid gap-4">
          {units.map(unit => {
            const unitContent = content.filter(c => c.unit_id === unit.id);
            return (
              <div key={unit.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <LuNotebookText className="text-stone-400" size={20} />
                  <h4 className="font-bold text-stone-800 dark:text-stone-200">{unit.title}</h4>
                </div>
                
                {unitContent.length > 0 ? (
                  <div className="grid gap-2 pl-8">
                    {unitContent.map(file => (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg text-sm border border-stone-100 dark:border-stone-800">
                        {file.file_type === "pdf" ? <FiFile className="text-red-500" /> 
                         : file.file_type === "word" ? <FaFileWord className="text-blue-600" />
                         : file.file_type === "powerpoint" ? <FaFilePowerpoint className="text-orange-500" />
                         : <FiImage className="text-blue-400" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-700 dark:text-stone-300 truncate">{file.title}</p>
                          <p className="text-xs text-stone-500 truncate">{file.file_name} ({(file.file_size / 1024).toFixed(1)} KB)</p>
                        </div>
                        <a 
                          href={file.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs bg-white dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-600 border border-stone-200 dark:border-stone-600 rounded-md transition-colors"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500 pl-8">No files in this unit.</p>
                )}
              </div>
            );
          })}
          {units.length === 0 && (
            <p className="text-stone-500 text-center py-8">This bracket has no units.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SharedBracket;
