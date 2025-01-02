import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/VolunteerSearchPage.css';
import apiClient from './../utils/apiClient';


function VolunteerSearchPage() {
    const [filters, setFilters] = useState({ region: '', date: '' });
    const [volunteerPosts, setVolunteerPosts] = useState([]);
    const [viewMyPosts, setViewMyPosts] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const userId = 1;

    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const handleViewMyPosts = () => {
        setViewMyPosts(!viewMyPosts);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredPosts = volunteerPosts.filter((post) => {
        return (
            (viewMyPosts ? post.userId === userId : true) &&
            (filters.region === '' || post.region.includes(filters.region)) &&
            (filters.date === '' || post.startDate <= filters.date && post.endDate >= filters.date)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    return (
        <div className="volunteer-search-page">
            <h1>봉사활동 찾아보기</h1>

            {/* 글 목록 */}
            <div className="volunteer-list">
                <h2>모든 글</h2>
                {currentPosts.length > 0 ? (
                    currentPosts.map((post) => (
                        <div key={post.id} className="volunteer-item">
                            <h3>{post.title}</h3>
                            <p>내용: {post.content}</p>
                            <p>봉사 기간: {post.startDate} ~ {post.endDate}</p>
                            <p>지역: {post.region}</p>
                        </div>
                    ))
                ) : (
                    <p>검색된 결과가 없습니다.</p>
                )}
            </div>

            {/* 검색창 */}
            <div className="search-bar">
                <select name="region" onChange={handleFilterChange}>
                    <option value="">지역 선택</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="광주광역시">광주광역시</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="세종특별자치시">세종특별자치시</option>
                    <option value="경기도">경기도</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                </select>
                <input type="date" name="date" onChange={handleFilterChange} />
                <button className="action-button" onClick={handleSearch}>
                    검색
                </button>
                <button className="action-button" onClick={() => navigate('/VolunteerCreatePage')}>
                    모집글 작성
                </button>
                <button className="action-button" onClick={handleViewMyPosts}>
                    {viewMyPosts ? '모든 글 보기' : '내가 작성한 글'}
                </button>
            </div>

            {/* 페이징 */}
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
        </div>
    );
}

export default VolunteerSearchPage;
