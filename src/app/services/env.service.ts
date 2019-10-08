import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'https://my-journal-api.herokuapp.com/api';

  constructor() { }
}
