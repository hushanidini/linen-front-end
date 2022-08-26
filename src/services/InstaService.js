import API from '../utils/api';

export const getInstaFeed = async () => {
    let insta = await API.get('http://localhost/wordpress/index.php/wp-json/wl/v1/insta');

    return insta.data;
};
