/**
 * CommentsContext - Comments and discussions on problems/questions
 *
 * Features:
 * - Add comments to questions
 * - View community comments
 * - Upvote helpful comments
 * - Get clarity on tricky concepts
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CommentsContext = createContext();

const STORAGE_KEY = 'angelo_comments';

export const CommentsProvider = ({ children, userId, supabase }) => {
    const [comments, setComments] = useState({});
    const [loading, setLoading] = useState(true);

    // Load comments from storage
    useEffect(() => {
        const loadComments = async () => {
            try {
                // Try localStorage first
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setComments(JSON.parse(stored));
                }

                // Sync with Supabase if available
                if (supabase) {
                    const { data, error } = await supabase
                        .from('problem_comments')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(500);

                    if (data && !error) {
                        const commentsByProblem = {};
                        data.forEach(comment => {
                            if (!commentsByProblem[comment.problem_id]) {
                                commentsByProblem[comment.problem_id] = [];
                            }
                            commentsByProblem[comment.problem_id].push(comment);
                        });
                        setComments(commentsByProblem);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(commentsByProblem));
                    }
                }
            } catch (error) {
                console.warn('[Comments] Load error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [supabase]);

    // Save to storage
    const saveToStorage = useCallback(async (newComments) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newComments));
        } catch (error) {
            console.warn('[Comments] Save error:', error);
        }
    }, []);

    // Add comment to a problem
    const addComment = useCallback(async (problemId, text, userName = 'Anonymous') => {
        const newComment = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            problem_id: problemId,
            user_id: userId,
            user_name: userName,
            text: text.trim(),
            upvotes: 0,
            upvoted_by: [],
            created_at: new Date().toISOString(),
        };

        // Update local state
        setComments(prev => {
            const problemComments = prev[problemId] || [];
            const updated = {
                ...prev,
                [problemId]: [newComment, ...problemComments],
            };
            saveToStorage(updated);
            return updated;
        });

        // Sync to Supabase if available
        if (supabase) {
            try {
                await supabase.from('problem_comments').insert(newComment);
            } catch (error) {
                console.warn('[Comments] Supabase insert error:', error);
            }
        }

        return newComment;
    }, [userId, supabase, saveToStorage]);

    // Delete comment
    const deleteComment = useCallback(async (problemId, commentId) => {
        setComments(prev => {
            const problemComments = prev[problemId] || [];
            const updated = {
                ...prev,
                [problemId]: problemComments.filter(c => c.id !== commentId),
            };
            saveToStorage(updated);
            return updated;
        });

        // Sync to Supabase
        if (supabase) {
            try {
                await supabase.from('problem_comments').delete().eq('id', commentId);
            } catch (error) {
                console.warn('[Comments] Delete error:', error);
            }
        }
    }, [supabase, saveToStorage]);

    // Upvote comment
    const upvoteComment = useCallback(async (problemId, commentId) => {
        setComments(prev => {
            const problemComments = prev[problemId] || [];
            const updated = {
                ...prev,
                [problemId]: problemComments.map(c => {
                    if (c.id === commentId) {
                        const alreadyUpvoted = c.upvoted_by?.includes(userId);
                        if (alreadyUpvoted) {
                            return {
                                ...c,
                                upvotes: Math.max(0, c.upvotes - 1),
                                upvoted_by: c.upvoted_by.filter(id => id !== userId),
                            };
                        } else {
                            return {
                                ...c,
                                upvotes: c.upvotes + 1,
                                upvoted_by: [...(c.upvoted_by || []), userId],
                            };
                        }
                    }
                    return c;
                }),
            };
            saveToStorage(updated);
            return updated;
        });

        // Sync to Supabase
        if (supabase) {
            try {
                const comment = comments[problemId]?.find(c => c.id === commentId);
                if (comment) {
                    await supabase.from('problem_comments')
                        .update({
                            upvotes: comment.upvotes,
                            upvoted_by: comment.upvoted_by,
                        })
                        .eq('id', commentId);
                }
            } catch (error) {
                console.warn('[Comments] Upvote sync error:', error);
            }
        }
    }, [userId, comments, supabase, saveToStorage]);

    // Get comments for a problem
    const getComments = useCallback((problemId) => {
        return comments[problemId] || [];
    }, [comments]);

    // Get comment count for a problem
    const getCommentCount = useCallback((problemId) => {
        return (comments[problemId] || []).length;
    }, [comments]);

    // Check if user has upvoted
    const hasUpvoted = useCallback((problemId, commentId) => {
        const comment = comments[problemId]?.find(c => c.id === commentId);
        return comment?.upvoted_by?.includes(userId) || false;
    }, [comments, userId]);

    const value = {
        comments,
        loading,
        addComment,
        deleteComment,
        upvoteComment,
        getComments,
        getCommentCount,
        hasUpvoted,
    };

    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    );
};

export const useComments = () => {
    const context = useContext(CommentsContext);
    if (!context) {
        return {
            comments: {},
            loading: false,
            addComment: () => {},
            deleteComment: () => {},
            upvoteComment: () => {},
            getComments: () => [],
            getCommentCount: () => 0,
            hasUpvoted: () => false,
        };
    }
    return context;
};

export default CommentsContext;
