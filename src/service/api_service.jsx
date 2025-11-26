// src/services/apiService.js

import axios from 'axios';

export default class ApiService {
  static async fetchData({ baseUrl, endpoint, headers = {}, fromJson, body = {} }) {
    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, body, {
        headers,
        timeout: 15000,
      });

      const data = response.data;

      if (
        (response.status === 200 || response.status === 201) &&
        data &&
        data.hasOwnProperty('data')
      ) {
        const responseData = data.data;

        if (Array.isArray(responseData)) {
          return responseData.map((item) => fromJson(item));
        } else if (typeof responseData === 'object') {
          return [fromJson(responseData)];
        } else {
          throw new Error(`Invalid "data" type: ${typeof responseData}`);
        }
      } else {
        console.warn('Unexpected or empty response:', data);
        return [];
      }
    } catch (error) {
      console.error('fetchData() error:', error);
      throw error;
    }
  }
}
