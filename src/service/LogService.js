
import axios from 'axios';
const MOVIE_API_ADMIN_URL = "https://backend-w87n.onrender.com/admin/logs";
export async function fetchLogs() {
    const response = await axios.get(MOVIE_API_ADMIN_URL);
    return response.data;
}

export async function archiveLogs(archivePath) {
    const response = await axios.get(MOVIE_API_ADMIN_URL+'/archive', {
        params: { archivePath },
        responseType: 'blob'
    });
    return response.data;
}

export async function deleteLogs() {
    await axios.delete(MOVIE_API_ADMIN_URL);
}
