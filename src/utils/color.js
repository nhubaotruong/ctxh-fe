import axios from 'axios';

export const getColorItem = async (_id) => {
    const url = `/api/color/item?_id=${_id}`;
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const getColorPage = async (pageNumber, pageSize, condition) => {
    const url = `/api/color/page?pageNumber=${pageNumber}&pageSize=${pageSize}` + (condition ? `&condition=${JSON.stringify(condition)}` : '');
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const getColorAll = async (condition) => {
    const url = `/api/color/all` + (condition ? `?condition=${JSON.stringify(condition)}` : '');
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const createColor = async (data) => {
    const url = `/api/color`;
    let res = await axios.post(url, data);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const updateColor = async (_id, changes) => {
    const url = `/api/color`;
    let res = await axios.put(url, { _id, changes });
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const deleteColor = async (_id) => {
    const url = `/api/color?_id=${_id}`;
    await axios.delete(url);
}
