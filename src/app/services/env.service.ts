import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://myjournal-api.local/api';
  // API_URL = 'https://my-journal-api.herokuapp.com/api';

  constructor() { }
}
