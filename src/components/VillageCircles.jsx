import React, { useState, useEffect } from 'react';
import { FiSend, FiUsers, FiAward, FiThumbsUp } from 'react-icons/fi';
import {
  getVillageCircles,
  joinVillageCircle,
  leaveVillageCircle,
  getCircleMembers,
  getCircleMessages,
  sendCircleMessage,
  subscribeToCircleMessages,
  markMessageHelpful
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
  const [loading, setLoading] = useState(true);

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
    const [messagesData, membersData] = await Promise.all([
      getCircleMessages(circle.id),
      getCircleMembers(circle.id)
    ]);
    setMessages(messagesData);
    setMembers(membersData);
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await sendCircleMessage({
      circleId: circle.id,
      userId: user.id,
      message: newMessage,
      isTeaching
    });

    setNewMessage('');
    setIsTeaching(false);
  };

  const handleMarkHelpful = async (messageId, teacherId) => {
    await markMessageHelpful(messageId, circle.id, teacherId);
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
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="text-lime-700 hover:text-lime-800 dark:text-lime-500 text-sm mb-2"
        >
          ← Back to circles
        </button>
        <h2 className="font-semibold text-xl">{circle.name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {members.length} members
        </p>
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
        {messages.map((msg) => {
          const isOwn = msg.user_id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  isOwn
                    ? 'bg-lime-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                } rounded-lg p-3`}
              >
                {!isOwn && (
                  <p className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    {msg.user?.full_name || 'Anonymous'}
                  </p>
                )}
                {msg.is_teaching && (
                  <span className="inline-block px-2 py-0.5 bg-yellow-500 text-white text-xs rounded mb-1">
                    Teaching 🎓
                  </span>
                )}
                <p className="text-sm">{msg.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                  {!isOwn && msg.is_teaching && (
                    <button
                      onClick={() => handleMarkHelpful(msg.id, msg.user_id)}
                      className="flex items-center gap-1 text-xs hover:opacity-80"
                    >
                      <FiThumbsUp size={12} />
                      <span>{msg.helpful_count || 0}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="isTeaching"
            checked={isTeaching}
            onChange={(e) => setIsTeaching(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="isTeaching" className="text-sm">
            I'm teaching/helping (earn points!)
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-lime-700 text-white rounded-lg hover:bg-lime-800 transition-colors"
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
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
