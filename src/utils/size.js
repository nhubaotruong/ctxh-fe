import axios from 'axios';

export const getSizeItem = async (_id) => {
    const url = `/api/size/item?_id=${_id}`;
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const getSizePage = async (pageNumber, pageSize, condition) => {
    const url = `/api/size/page?pageNumber=${pageNumber}&pageSize=${pageSize}` + (condition ? `&condition=${JSON.stringify(condition)}` : '');
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const getSizeAll = async (condition) => {
    const url = `/api/size/all` + (condition ? `?condition=${JSON.stringify(condition)}` : '');
    let res = await axios.get(url);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const createSize = async (data) => {
    const url = `/api/size`;
    let res = await axios.post(url, data);
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const updateSize = async (_id, changes) => {
    const url = `/api/size`;
    let res = await axios.put(url, { _id, changes });
    if (res.data.error) {
        return [];
    }
    return res.data.result;
}
export const deleteSize = async (_id) => {
    const url = `/api/size?_id=${_id}`;
    await axios.delete(url);
}
