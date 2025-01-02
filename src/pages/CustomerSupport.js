import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Accordion } from 'react-bootstrap';
import apiClient from './../utils/apiClient';
import { UserContext } from '../App'; // UserContext 가져오기
import '../components/styles/CustomerSupport.css';

function CustomerSupport() {
    const { isLoggedIn, userInfo } = useContext(UserContext); // 유저 로그인 정보 가져오기

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '일반 문의', // 기본 카테고리
        inquiry: '',
    });

    // 유저 정보 동기화
    useEffect(() => {
        if (isLoggedIn && userInfo) {
            setFormData({
                name: userInfo.username, // userInfo.username 사용
                email: userInfo.email,
                category: '일반 문의', // 기본 카테고리 설정
                inquiry: '',
            });
        }
    }, [isLoggedIn, userInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!formData.inquiry.trim()) {
            alert('문의 내용을 입력하세요.');
            return;
        }

        try {
            // 컨트롤러에 맞는 요청 구조
            const response = await apiClient.post('/api/inquiries', {
                category: formData.category, // 카테고리 필드 추가
                content: formData.inquiry, // content 필드로 문의 내용을 전달
            });
            alert('문의가 성공적으로 접수되었습니다.');
            console.log('문의 등록 성공:', response.data);
            setFormData((prev) => ({ ...prev, inquiry: '' })); // 문의 내용 초기화
        } catch (error) {
            console.error('문의 등록 실패:', error.response?.data || error.message);
            alert('문의 등록에 실패했습니다.');
        }
    };

    return (
        <Container style={{ padding: '40px 20px', marginTop: '40px' }}>
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: '#4CAF50', fontWeight: 'bold' }}>고객센터</h1>
                    <p>궁금하신 점이 있으시면 언제든 문의해주세요. 아래 FAQ를 참고하거나 문의 폼을 작성해 주세요.</p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <div className="faq-section">
                        <h2 style={{ color: '#4CAF50' }}>자주 묻는 질문 (FAQ)</h2>
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Q. 회원가입은 어떻게 하나요?</Accordion.Header>
                                <Accordion.Body>
                                    회원가입은 상단 네비게이션바의 '회원가입' 버튼을 클릭한 뒤, 정보를 입력하여 진행하시면 됩니다.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Q. ID/PW를 잊어버렸어요. 어떻게 찾을 수 있나요?</Accordion.Header>
                                <Accordion.Body>
                                    로그인 창에서 'ID/PW 찾기' 버튼을 클릭하면, 등록된 이메일로 ID 또는 비밀번호 재설정 안내를 받을 수 있습니다.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Q. 봉사활동 관련 문의는 어떻게 하나요?</Accordion.Header>
                                <Accordion.Body>
                                    봉사활동 게시판에서 질문을 남기거나 고객센터로 문의 주시면 친절히 안내해드리겠습니다.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <div className="inquiry-section">
                        <h2 style={{ color: '#4CAF50' }}>문의하기</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>문의 카테고리</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="일반 문의">일반 문의</option>
                                    <option value="회원 정보">회원 정보</option>
                                    <option value="봉사 활동">봉사 활동</option>
                                    <option value="기타">기타</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>이름</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>이메일</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formInquiry">
                                <Form.Label>문의 내용</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="inquiry"
                                    placeholder="문의 내용을 입력하세요"
                                    value={formData.inquiry}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" className="w-100">
                                문의하기
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default CustomerSupport;
