import axios from "axios";

export default async function ApiRequest(url) {
	return axios.get(url);
}
