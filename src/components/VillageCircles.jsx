import React, { useState, useEffect } from 'react';
import { FiSend, FiUsers, FiAward, FiThumbsUp, FiBookOpen, FiVideo, FiFileText, FiLink, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import {
  getVillageCircles,
  joinVillageCircle,
  leaveVillageCircle,
  getCircleMembers,
  getCircleMessages,
  sendCircleMessage,
  subscribeToCircleMessages,
  markMessageHelpful,
  getCircleResources,
  addCircleResource,
  markAnswerAsHelpful,
  generateCircleLearningContent
} from '../services/villageCircleService';
import { useAuth } from '../contexts/AuthContext';

const VillageCircleCard = ({ circle, onJoin, userCircles }) => {
  const isMember = userCircles.includes(circle.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{circle.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {circle.description}
          </p>
        </div>
        <span className="px-2 py-1 bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 rounded text-xs">
          {circle.category}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FiUsers size={16} />
            {circle.members?.[0]?.count || 0} members
          </span>
        </div>
        
        <button
          onClick={() => onJoin(circle.id)}
          disabled={isMember}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isMember
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-lime-700 text-white hover:bg-lime-800'
          }`}
        >
          {isMember ? 'Joined' : 'Join Circle'}
        </button>
      </div>
    </div>
  );
};

const CircleChat = ({ circle, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [isTeaching, setIsTeaching] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'resources'
  const [resources, setResources] = useState([]);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', type: 'article', url: '', description: '' });
  const [generatingContent, setGeneratingContent] = useState(false);

  useEffect(() => {
    loadCircleData();

    // Subscribe to real-time messages
    const channel = subscribeToCircleMessages(circle.id, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      channel?.unsubscribe();
    };
  }, [circle.id]);

  const loadCircleData = async () => {
    setLoading(true);
    const [messagesData, membersData, resourcesData] = await Promise.all([
      getCircleMessages(circle.id),
      getCircleMembers(circle.id),
      getCircleResources(circle.id)
    ]);
    setMessages(messagesData);
    setMembers(membersData);
    setResources(resourcesData);
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await sendCircleMessage({
      circleId: circle.id,
      userId: user.id,
      message: newMessage,
      isTeaching,
      isQuestion,
      replyToId: replyingTo
    });

    setNewMessage('');
    setIsTeaching(false);
    setIsQuestion(false);
    setReplyingTo(null);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url || !user) return;

    await addCircleResource({
      circleId: circle.id,
      userId: user.id,
      ...newResource
    });

    setNewResource({ title: '', type: 'article', url: '', description: '' });
    setShowAddResource(false);
    loadCircleData();
  };

  const handleGenerateContent = async () => {
    setGeneratingContent(true);
    const content = await generateCircleLearningContent(circle.name, circle.category);
    if (content) {
      setResources(prev => [content, ...prev]);
    }
    setGeneratingContent(false);
  };

  const handleMarkHelpful = async (messageId, teacherId, questionId = null) => {
    if (questionId) {
      // This is marking an answer to a question as helpful
      await markAnswerAsHelpful(messageId, questionId, circle.id, teacherId, user.id);
    } else {
      // Regular helpful marking
      await markMessageHelpful(messageId, circle.id, teacherId);
    }
    // Refresh to show updated helpful count
    loadCircleData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 border-b border-indigo-700">
        <button
          onClick={onBack}
          className="text-white hover:text-indigo-200 text-sm mb-2 flex items-center gap-1"
        >
          ← Back to circles
        </button>
        <h2 className="font-semibold text-xl">{circle.name}</h2>
        <p className="text-sm text-indigo-100 mt-1">
          {members.length} members • {circle.category}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <FiUsers className="inline mr-2" />
          Discussion
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'resources'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <FiBookOpen className="inline mr-2" />
          Resources ({resources.length})
        </button>
      </div>

      {/* Leaderboard */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <FiAward className="text-yellow-600" />
          <span className="font-medium text-sm">Top Teachers</span>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {members.slice(0, 5).map((member, idx) => (
            <div
              key={member.id}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm whitespace-nowrap"
            >
              <span className="font-bold text-yellow-600">#{idx + 1}</span>
              <span>{member.user?.full_name || 'Anonymous'}</span>
              <span className="text-yellow-600 font-semibold">
                {member.teaching_points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'chat' ? (
          <>
            {messages.map((msg) => {
              const isOwn = msg.user_id === user?.id;
              const isQuestionOwner = msg.reply_to && messages.find(m => m.id === msg.reply_to)?.user_id === user?.id;
              const replies = messages.filter(m => m.reply_to === msg.id);
              
              return (
                <div key={msg.id}>
                  <div
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwn
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : msg.is_question
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 text-gray-900 dark:text-gray-100'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      } rounded-lg p-3`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {msg.user?.full_name || 'Anonymous'}
                          {msg.user_points > 0 && (
                            <span className="ml-2 text-yellow-600">⭐ {msg.user_points} pts</span>
                          )}
                        </p>
                      )}
                      
                      {msg.reply_to && (
                        <div className="text-xs opacity-70 mb-1 italic">
                          Replying to a question...
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2">
                        {msg.is_question && <FiHelpCircle className="flex-shrink-0 mt-0.5" />}
                        {msg.is_teaching && !msg.reply_to && (
                          <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded">
                            🎓 Teaching
                          </span>
                        )}
                        {msg.reply_to && msg.is_teaching && (
                          <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs rounded">
                            💡 Answer
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm mt-1">{msg.message}</p>
                      
                      <div className="flex items-center justify-between mt-2 gap-3">
                        <span className="text-xs opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {msg.is_question && !isOwn && (
                            <button
                              onClick={() => {
                                setReplyingTo(msg.id);
                                setIsTeaching(true);
                              }}
                              className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded"
                            >
                              💬 Reply
                            </button>
                          )}
                          
                          {!isOwn && (msg.is_teaching || msg.reply_to) && (
                            <button
                              onClick={() => handleMarkHelpful(msg.id, msg.user_id, msg.reply_to)}
                              disabled={msg.marked_helpful_by?.includes(user?.id)}
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                                msg.marked_helpful_by?.includes(user?.id)
                                  ? 'bg-green-500 text-white cursor-not-allowed'
                                  : 'bg-white/20 hover:bg-white/30'
                              }`}
                            >
                              {msg.marked_helpful_by?.includes(user?.id) ? (
                                <><FiCheckCircle size={12} /> Marked Helpful</>
                              ) : (
                                <><FiThumbsUp size={12} /> {msg.helpful_count || 0}</>
                              )}
                            </button>
                          )}
                          
                          {isQuestionOwner && msg.reply_to && !msg.validated_by_asker && (
                            <button
                              onClick={() => handleMarkHelpful(msg.id, msg.user_id, msg.reply_to)}
                              className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
                            >
                              ✓ Mark as Solved
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {msg.validated_by_asker && (
                        <div className="mt-2 text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          ✓ Verified Answer (+20 pts to helper)
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Show replies indented */}
                  {replies.length > 0 && (
                    <div className="ml-8 mt-2 space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800 pl-3">
                      {replies.map(reply => {
                        const replyIsOwn = reply.user_id === user?.id;
                        return (
                          <div key={reply.id} className={`flex ${replyIsOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[85%] bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-2 text-sm">
                              <p className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                                {reply.user?.full_name || 'Anonymous'}
                              </p>
                              <p className="text-gray-800 dark:text-gray-200">{reply.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="space-y-4">
            {/* AI Generate Button */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <BsStars className="text-purple-600" />
                    AI-Generated Learning Content
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Generate personalized study materials for this circle
                  </p>
                </div>
                <button
                  onClick={handleGenerateContent}
                  disabled={generatingContent}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 text-sm font-medium"
                >
                  {generatingContent ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>

            {/* Add Resource Button */}
            <button
              onClick={() => setShowAddResource(!showAddResource)}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + Add Learning Resource
            </button>

            {/* Add Resource Form */}
            {showAddResource && (
              <form onSubmit={handleAddResource} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Resource Title"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  required
                />
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="article">📄 Article</option>
                  <option value="video">🎥 Video</option>
                  <option value="pdf">📑 PDF</option>
                  <option value="link">🔗 Link</option>
                </select>
                <input
                  type="url"
                  placeholder="URL"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows="2"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Resource
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddResource(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Resources List */}
            {resources.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiBookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>No resources yet. Be the first to add one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resources.map((resource) => {
                  const icons = {
                    article: <FiFileText className="text-blue-600" />,
                    video: <FiVideo className="text-red-600" />,
                    pdf: <FiFileText className="text-orange-600" />,
                    link: <FiLink className="text-green-600" />,
                    ai_generated: <BsStars className="text-purple-600" />
                  };
                  
                  return (
                    <div
                      key={resource.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{icons[resource.type]}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {resource.title}
                          </h4>
                          {resource.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {resource.description}
                            </p>
                          )}
                          {resource.content && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {resource.content}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              Added by {resource.user?.full_name || 'AI'} • {new Date(resource.created_at).toLocaleDateString()}
                            </span>
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                View Resource →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      {activeTab === 'chat' && (
        <form
          onSubmit={handleSendMessage}
          className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700"
        >
          {replyingTo && (
            <div className="mb-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-between">
              <span className="text-sm text-indigo-700 dark:text-indigo-300">
                💬 Replying to a question...
              </span>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setIsTeaching(false);
                }}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isQuestion"
                checked={isQuestion}
                onChange={(e) => {
                  setIsQuestion(e.target.checked);
                  if (e.target.checked) setIsTeaching(false);
                }}
                disabled={replyingTo}
                className="rounded"
              />
              <label htmlFor="isQuestion" className="text-sm flex items-center gap-1">
                <FiHelpCircle size={14} />
                Ask a Question
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isTeaching"
                checked={isTeaching}
                onChange={(e) => {
                  setIsTeaching(e.target.checked);
                  if (e.target.checked) setIsQuestion(false);
                }}
                className="rounded"
              />
              <label htmlFor="isTeaching" className="text-sm flex items-center gap-1">
                🎓 I'm teaching/helping (earn points!)
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                replyingTo 
                  ? "Share your answer..." 
                  : isQuestion 
                  ? "Ask your question..." 
                  : "Type your message..."
              }
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const VillageCircles = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState([]);
  const [userCircles, setUserCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    setLoading(true);
    const data = await getVillageCircles();
    setCircles(data);
    setLoading(false);
  };

  const handleJoinCircle = async (circleId) => {
    if (!user) return;
    await joinVillageCircle(circleId, user.id);
    setUserCircles((prev) => [...prev, circleId]);
  };

  if (selectedCircle) {
    return (
      <CircleChat
        circle={selectedCircle}
        onBack={() => setSelectedCircle(null)}
      />
    );
  }

  return (
    <div className="min-h-screen p-5 geist-font">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Village Learning Circles</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Join small groups to learn together, help others, and earn teaching points!
        </p>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {circles.map((circle) => (
              <div key={circle.id} onClick={() => setSelectedCircle(circle)}>
                <VillageCircleCard
                  circle={circle}
                  onJoin={handleJoinCircle}
                  userCircles={userCircles}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageCircles;
