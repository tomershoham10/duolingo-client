import Cookies from 'js-cookie';

const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('courseData');
    Cookies.remove('jwtToken');
    window.location.href = '/login';
};

export default handleLogout;