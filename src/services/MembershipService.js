import API from '../utils/api';

export const fetchMemberships = async () => {
    let branches = await API.get('public/membership');

    return branches.data;
};
