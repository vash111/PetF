import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import apiClient from '../utils/apiClient';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import '../components/styles/FreeBoardDetailPage.css';

function FreeBoardDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userInfo } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedPostContent, setEditedPostContent] = useState('');

    useEffect(() => {
        fetchPostDetails();
        fetchComments();
    }, []);

    const fetchPostDetails = async () => {
        try {
            const response = await apiClient.get(`/api/freeboard/${id}`);
            setPost(response.data);
        } catch (error) {
            console.error('게시글 불러오기 실패:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await apiClient.get(`/api/freeboard/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('댓글 불러오기 실패:', error);
        }
    };

    const handleLikePost = async () => {
        try {
            await apiClient.post(`/api/freeboard/${id}/like`);
            setPost((prevPost) => ({
                ...prevPost,
                likes: prevPost.likedByUser ? prevPost.likes - 1 : prevPost.likes + 1,
                likedByUser: !prevPost.likedByUser,
            }));
        } catch (error) {
            console.error('좋아요 토글 실패:', error);
        }
    };

    const handleEditPost = () => {
        setIsEditingPost(true);
        setEditedPostContent(post.content);
    };

    const handleUpdatePost = async () => {
        try {
            await apiClient.put(`/api/freeboard/${id}`, { content: editedPostContent });
            setPost((prevPost) => ({ ...prevPost, content: editedPostContent }));
            setIsEditingPost(false);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            await apiClient.delete(`/api/freeboard/${id}`);
            navigate('/freeboard'); // 게시판 목록으로 이동
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('댓글 내용을 입력하세요.');
            return;
        }

        try {
            await apiClient.post(`/api/freeboard/${id}/comments`, { content: newComment });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('댓글 추가 실패:', error);
        }
    };

    const handleEditComment = (comment) => {
        setEditCommentId(comment.id);
        setEditCommentContent(comment.content);
    };

    const handleUpdateComment = async () => {
        if (!editCommentContent.trim()) {
            alert('댓글 내용을 입력하세요.');
            return;
        }

        try {
            await apiClient.put(`/api/freeboard/${id}/comments/${editCommentId}`, { content: editCommentContent });
            setEditCommentId(null);
            setEditCommentContent('');
            fetchComments();
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await apiClient.delete(`/api/freeboard/${id}/comments/${commentId}`);
            fetchComments();
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
        }
    };

    const formatDate = (isoString) => format(new Date(isoString), 'yyyy.MM.dd HH:mm', { locale: ko });

    return (
        <div className="detail-container">
            {post && (
                <div className="post-detail">
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <div>작성자: {post.authorUsername}</div>
                        <div>작성 시간: {formatDate(post.createdAt)}</div>
                        <div>조회수: {post.views}</div>
                    </div>
                    {isEditingPost ? (
                        <div className="post-edit">
                            <textarea
                                value={editedPostContent}
                                onChange={(e) => setEditedPostContent(e.target.value)}
                            />
                            <button onClick={handleUpdatePost}>수정 완료</button>
                            <button onClick={() => setIsEditingPost(false)}>취소</button>
                        </div>
                    ) : (
                        <div className="post-content">
                            <p>{post.content}</p>
                            {isLoggedIn && userInfo.username === post.authorUsername && (
                                <div className="post-actions">
                                    <button onClick={handleEditPost}>수정</button>
                                    <button onClick={handleDeletePost}>삭제</button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="like-button-container">
                        <button onClick={handleLikePost} className="like-button">
                            {post.likedByUser ? '👎 좋아요 취소' : '👍 좋아요'} ({post.likes})
                        </button>
                    </div>
                </div>
            )}
            <div className="comments-section">
                <h2>댓글</h2>
                <ul className="comments-list">
                    {comments.map((comment) => (
                        <li key={comment.id} className="comment-item">
                            {editCommentId === comment.id ? (
                                <div className="edit-comment">
                                    <textarea
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                    />
                                    <button onClick={handleUpdateComment}>수정 완료</button>
                                    <button onClick={() => setEditCommentId(null)}>취소</button>
                                </div>
                            ) : (
                                <div>
                                    <span className="comment-username">{comment.authorUsername}:</span>
                                    <span className="comment-content">{comment.content}</span>
                                    <span className="comment-createdAt">{formatDate(comment.createdAt)}</span>
                                    {isLoggedIn && userInfo.username === comment.authorUsername && (
                                        <div className="comment-actions">
                                            <button onClick={() => handleEditComment(comment)}>수정</button>
                                            <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                {isLoggedIn && (
                    <div className="add-comment">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요."
                        />
                        <button onClick={handleAddComment}>댓글 작성</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FreeBoardDetailPage;
