class Resourse {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }
  
  request(uri, method, data) {
    return fetch(this._baseUrl + uri, {
      method,
      body: data ? JSON.stringify(data) : null,
      headers: {
        'Content-Type' : 'application/json',
      },
    })
    .then(response => response.json());
  }

  get(uri ='') {
    return this.request(uri, 'GET');
  }

  delete(id) {
    return this.request(id, 'DELETE')
  }

  post(data) {
    return this.request('', 'POST', data);
  }

  add(data) {
    return this.post(data);
  }

  list() {
    return this.get();
  }
}