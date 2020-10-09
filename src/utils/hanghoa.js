import axios from 'axios';

export const getHanghoaItem = async (_id) => {
    const url = `/api/hanghoa/item?_id=${_id}`;
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const getHanghoaPage = async (pageNumber, pageSize, condition) => {
    const url = `/api/hanghoa/page?pageNumber=${pageNumber}&pageSize=${pageSize}` + (condition ? `&condition=${JSON.stringify(condition)}` : '');
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const getHanghoaAll = async (condition) => {
    const url = `/api/hanghoa/all` + (condition ? `?condition=${JSON.stringify(condition)}` : '');
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const createHanghoa = async (data) => {
    const url = `/api/hanghoa`;
    let res = await axios.post(url, data);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const updateHanghoa = async (_id, changes) => {
    const url = `/api/hanghoa`;
    let res = await axios.put(url, { _id, changes });
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const deleteHanghoa = async (_id) => {
    const url = `/api/hanghoa?_id=${_id}`;
    await axios.delete(url);
}
