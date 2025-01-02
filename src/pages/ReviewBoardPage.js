import React, { useState, useEffect } from 'react';
import '../components/styles/ReviewBoardPage.css';
import apiClient from './../utils/apiClient';

function ReviewBoardPage() {
    const [reviews, setReviews] = useState([]); // 서버에서 가져온 후기 목록
    const [newReview, setNewReview] = useState({ title: '', content: '', author: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 서버에서 후기 목록 가져오기
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get('/api/reviews'); // 서버의 후기 목록 API
                setReviews(response.data);
            } catch (error) {
                console.error('후기 데이터를 가져오는 중 오류 발생:', error.response?.data || error.message);
                alert('후기 데이터를 가져오는 데 실패했습니다.');
            }
        };

        fetchReviews();
    }, []);

    // 새 후기를 서버에 추가
    const handleAddReview = async () => {
        if (!newReview.title || !newReview.content || !newReview.author) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const response = await apiClient.post('/api/reviews', newReview); // 서버의 후기 작성 API
            setReviews((prev) => [...prev, response.data]); // 서버 응답 데이터를 추가
            setNewReview({ title: '', content: '', author: '' });
            setIsModalOpen(false);
            alert('후기가 등록되었습니다.');
        } catch (error) {
            console.error('후기 등록 실패:', error.response?.data || error.message);
            alert('후기를 등록하는 데 실패했습니다.');
        }
    };

    // 후기 검색
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 검색된 후기와 페이징 처리
    const filteredReviews = reviews.filter((review) =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    return (
        <div className="review-board-page">
            <h1>봉사활동 후기 게시판</h1>

            {/* 후기 목록 */}
            <div className="review-list">
                <h2>후기 목록</h2>
                {currentReviews.length > 0 ? (
                    currentReviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <h3>{review.title}</h3>
                            <p>{review.content}</p>
                            <div className="review-meta">
                                <span>작성자: {review.author}</span>
                                <span>작성일: {review.date}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>등록된 후기가 없습니다.</p>
                )}
            </div>

            {/* 글 검색 및 작성 */}
            <div className="search-and-create">
                <input
                    type="text"
                    placeholder="후기 제목 검색"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button className="create-button" onClick={() => setIsModalOpen(true)}>
                    후기 작성
                </button>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* 후기 작성 모달 */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>후기 작성</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="제목을 입력하세요"
                            value={newReview.title}
                            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        />
                        <textarea
                            name="content"
                            placeholder="내용을 입력하세요"
                            value={newReview.content}
                            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                            rows="4"
                        />
                        <input
                            type="text"
                            name="author"
                            placeholder="작성자 이름"
                            value={newReview.author}
                            onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                        />
                        <button onClick={handleAddReview} className="modal-button">
                            등록
                        </button>
                        <button onClick={() => setIsModalOpen(false)} className="modal-button">
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewBoardPage;
