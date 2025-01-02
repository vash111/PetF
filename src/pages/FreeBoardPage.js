import React, { useState } from 'react';
import '../components/styles/FreeBoardPage.css';

function FreeBoardPage({ loggedInUser }) {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const itemsPerPage = 5;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setIsEditMode(true);
            setCurrentPost(post);
        } else {
            setIsEditMode(false);
            setCurrentPost({ title: '', category: '잡담', content: '', author: loggedInUser, views: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPost(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSavePost = () => {
        if (isEditMode) {
            setPosts((prev) =>
                prev.map((post) => (post.id === currentPost.id ? currentPost : post))
            );
        } else {
            setPosts((prev) => [
                ...prev,
                { ...currentPost, id: prev.length + 1, date: 'DB에서 받아올 예정' },
            ]);
        }
        handleCloseModal();
    };

    const handleDeletePost = (id) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            setPosts((prev) => prev.filter((post) => post.id !== id));
        }
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    return (
        <div className="free-board-page">
            <h1 className="centered">자유게시판</h1>
            <div className="top-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력해주세요."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button className="search-button">검색</button>
                <button
                    onClick={() => handleOpenModal()}
                    className="create-button"
                >
                    글 작성
                </button>
            </div>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>카테고리</th>
                        <th>이름</th>
                        <th>조회수</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                            <tr key={index}>
                                <td>{startIndex + index + 1}</td>
                                <td>{post.title}</td>
                                <td>{post.category}</td>
                                <td>{post.author}</td>
                                <td>{post.views}</td>
                                <td>
                                    <button
                                        onClick={() => handleOpenModal(post)}
                                        className="edit-button"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="delete-button"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditMode ? '글 수정' : '글 작성'}</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="제목"
                            value={currentPost.title}
                            onChange={handleInputChange}
                        />
                        <select
                            name="category"
                            value={currentPost.category}
                            onChange={handleInputChange}
                        >
                            <option value="잡담">잡담</option>
                            <option value="질문">질문</option>
                            <option value="정보">정보</option>
                        </select>
                        <textarea
                            name="content"
                            placeholder="내용을 입력하세요."
                            value={currentPost.content}
                            onChange={handleInputChange}
                            rows="5"
                            className="content-textarea"
                        ></textarea>
                        <button onClick={handleSavePost} className="save-button">
                            저장
                        </button>
                        <button onClick={handleCloseModal} className="cancel-button">
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FreeBoardPage;
