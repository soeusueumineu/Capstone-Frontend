document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:8080/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => {
            if (!response.ok) {
                // 상태 코드에 따라 다른 메시지 처리
                if(response.status === 401) {
                    throw new Error('비밀번호가 틀렸습니다');
                } else if(response.status === 404) {
                    throw new Error('존재하지 않는 이메일입니다');
                } else {
                    throw new Error('로그인 처리 중 문제가 발생했습니다');
                }
            }
            return response.json();
        })
        .then(data => {
            console.log('Login Success:', data);
            alert('로그인 되었습니다');
            window.location.href = 'main.html'; // 성공 시 리다이렉션할 페이지
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
});
