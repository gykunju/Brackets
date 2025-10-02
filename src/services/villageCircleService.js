import { supabase } from '../config/supabase';

// Create a new village learning circle
export const createVillageCircle = async (circleData) => {
  try {
    const { data, error } = await supabase
      .from('village_circles')
      .insert([
        {
          name: circleData.name,
          description: circleData.description,
          category: circleData.category,
          creator_id: circleData.creatorId,
          max_members: circleData.maxMembers || 10,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating village circle:', error);
    return null;
  }
};

// Get all village circles
export const getVillageCircles = async () => {
  try {
    const { data, error } = await supabase
      .from('village_circles')
      .select(`
        *,
        creator:users!village_circles_creator_id_fkey(id, full_name, avatar_url),
        members:circle_members(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching village circles:', error);
    return [];
  }
};

// Join a village circle
export const joinVillageCircle = async (circleId, userId) => {
  try {
    const { data, error } = await supabase
      .from('circle_members')
      .insert([
        {
          circle_id: circleId,
          user_id: userId,
          teaching_points: 0,
          joined_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error joining village circle:', error);
    return null;
  }
};

// Leave a village circle
export const leaveVillageCircle = async (circleId, userId) => {
  try {
    const { error } = await supabase
      .from('circle_members')
      .delete()
      .eq('circle_id', circleId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error leaving village circle:', error);
    return false;
  }
};

// Get circle members
export const getCircleMembers = async (circleId) => {
  try {
    const { data, error } = await supabase
      .from('circle_members')
      .select(`
        *,
        user:users!circle_members_user_id_fkey(id, full_name, avatar_url)
      `)
      .eq('circle_id', circleId)
      .order('teaching_points', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching circle members:', error);
    return [];
  }
};

// Subscribe to real-time circle messages
export const subscribeToCircleMessages = (circleId, callback) => {
  const channel = supabase
    .channel(`circle_messages:${circleId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'circle_messages',
        filter: `circle_id=eq.${circleId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
};

// Send a message to circle
export const sendCircleMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      .from('circle_messages')
      .insert([
        {
          circle_id: messageData.circleId,
          user_id: messageData.userId,
          message: messageData.message,
          is_teaching: messageData.isTeaching || false,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error sending circle message:', error);
    return null;
  }
};

// Get circle messages
export const getCircleMessages = async (circleId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('circle_messages')
      .select(`
        *,
        user:users!circle_messages_user_id_fkey(id, full_name, avatar_url)
      `)
      .eq('circle_id', circleId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching circle messages:', error);
    return [];
  }
};

// Award teaching points
export const awardTeachingPoints = async (circleId, userId, points) => {
  try {
    const { data, error } = await supabase
      .from('circle_members')
      .update({ teaching_points: supabase.raw(`teaching_points + ${points}`) })
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error awarding teaching points:', error);
    return null;
  }
};

// Mark message as helpful (awards teaching points)
export const markMessageHelpful = async (messageId, circleId, teacherId) => {
  try {
    // Update message
    await supabase
      .from('circle_messages')
      .update({ helpful_count: supabase.raw('helpful_count + 1') })
      .eq('id', messageId);

    // Award teaching points
    await awardTeachingPoints(circleId, teacherId, 10);

    return true;
  } catch (error) {
    console.error('Error marking message as helpful:', error);
    return false;
  }
};
