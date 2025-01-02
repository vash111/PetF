import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../App';
import apiClient from '../utils/apiClient';
import '../components/styles/FreeBoardDetailPage.css';

function FreeBoardDetailPage() {
    const { id } = useParams();
    const { isLoggedIn } = useContext(UserContext); // userInfo 제거
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null); // 수정 중인 댓글 ID
    const [editCommentContent, setEditCommentContent] = useState(''); // 수정 중인 댓글 내용
    const [username, setUsername] = useState(''); // 세션에서 username 가져오기

    useEffect(() => {
        fetchPostDetails();
        fetchComments();
        increaseViewCount();
        fetchUserSession(); // 세션에서 username 가져오기
    }, []);

    const fetchPostDetails = async () => {
        try {
            const response = await apiClient.get(`/api/freeboard/${id}`);
            setPost({
                ...response.data,
                likedByUser: response.data.likedByUser, // 백엔드에서 제공된 likedByUser 상태
            });
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

    const increaseViewCount = async () => {
        try {
            await apiClient.post(`/api/freeboard/${id}/view`);
        } catch (error) {
            console.error('조회수 증가 실패:', error);
        }
    };

    const fetchUserSession = async () => {
        try {
            const response = await apiClient.get('/api/users/session');
            setUsername(response.data.username); // 세션에서 username 가져오기
        } catch (error) {
            console.error('세션 정보 가져오기 실패:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert('댓글 내용을 입력하세요.');
            return;
        }

        try {
            const response = await apiClient.post(`/api/freeboard/${id}/comments`, {
                content: newComment,
                username: username, // 세션에서 가져온 username 사용
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('댓글 추가 실패:', error.response?.data || error.message);
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
            await apiClient.put(`/api/freeboard/${id}/comments/${editCommentId}`, {
                content: editCommentContent,
            });
            setEditCommentId(null);
            setEditCommentContent('');
            fetchComments();
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditCommentId(null);
        setEditCommentContent('');
    };

    const handleLikePost = async () => {
        try {
            const wasLiked = post.likedByUser; // 사용자가 이미 좋아요를 눌렀는지 확인
            await apiClient.post(`/api/freeboard/${id}/like`);

            // 좋아요 상태를 반대로 토글
            setPost((prevPost) => ({
                ...prevPost,
                likes: wasLiked ? prevPost.likes - 1 : prevPost.likes + 1,
                likedByUser: !wasLiked, // 좋아요 상태 반전
            }));
        } catch (error) {
            console.error('좋아요 토글 실패:', error);
        }
    };

    return (
        <div className="detail-container">
            {post && (
                <div className="post-detail">
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <div className="post-meta">
                        <span>작성자: {post.authorUsername}</span>
                        <span>조회수: {post.views}</span>
                    </div>
                    <button onClick={handleLikePost}>
                        {post.likedByUser ? '👎' : '👍'} ({post.likes || 0})
                    </button>
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
                                    <button onClick={handleCancelEdit}>취소</button>
                                </div>
                            ) : (
                                <div>
                                    <span className="comment-username">{comment.authorUsername}:</span>
                                    <span className="comment-content">{comment.content}</span>
                                    {isLoggedIn && username === comment.username && (
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
