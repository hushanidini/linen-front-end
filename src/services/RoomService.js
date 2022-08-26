import API from '../utils/api';

export const getAllStudios = async () => {
    let studois = await API.get('http://localhost/wordpress/index.php/wp-json/std/studio');

    return studois.data;
};
